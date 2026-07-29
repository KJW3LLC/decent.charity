#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TOPICS_FILE = path.join(__dirname, '..', 'topics.json');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify question
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Validate category
function isValidCategory(category) {
  return ['food-pantries', 'support-services', 'shelters-and-housing'].includes(category.toLowerCase());
}

// Main function
async function addTopic() {
  console.log('\nAdd New Article Topic to decent.charity\n');
  console.log('This will add a new topic to topics.json\n');

  try {
    // Get title
    const title = await question('Topic title: ');
    if (!title.trim()) {
      console.log('❌ Title cannot be empty');
      process.exit(1);
    }

    const organization = await question('Organization name: ');
    if (!organization.trim()) {
      console.log('❌ Organization cannot be empty');
      process.exit(1);
    }

    // Get category
    let category;
    while (true) {
      category = await question('Category (food-pantries/support-services/shelters-and-housing): ');
      if (isValidCategory(category)) {
        category = category.toLowerCase();
        break;
      }
      console.log('❌ Invalid category');
    }

    const source = await question('Official source URL (https://...): ');
    try {
      const parsedSource = new URL(source);
      if (parsedSource.protocol !== 'https:') throw new Error('HTTPS required');
    } catch {
      console.log('❌ Source must be a valid HTTPS URL');
      process.exit(1);
    }

    // Get tags
    const tagsInput = await question('Tags (comma-separated, e.g., "ai, machine-learning, basics"): ');
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    if (tags.length === 0) {
      console.log('❌ At least one tag is required');
      process.exit(1);
    }

    // Create topic object
    const newTopic = {
      title: title.trim(),
      organization: organization.trim(),
      category,
      source: source.trim(),
      tags
    };

    // Load existing topics
    const topics = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf-8'));

    // Check for duplicates
    const duplicate = topics.find(t => t.title.toLowerCase() === newTopic.title.toLowerCase());
    if (duplicate) {
      console.log(`\n⚠️  Warning: A topic with similar title already exists:`);
      console.log(`   "${duplicate.title}"`);
      const proceed = await question('\nAdd anyway? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        console.log('❌ Cancelled');
        process.exit(0);
      }
    }

    // Add new topic
    topics.push(newTopic);

    // Save topics
    fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2) + '\n');

    console.log('\n✅ Topic added successfully!');
    console.log('\nNew topic:');
    console.log(JSON.stringify(newTopic, null, 2));
    console.log(`\nTotal topics: ${topics.length}`);
    console.log('\nNext steps:');
    console.log('1. Review the topic in topics.json');
    console.log('2. Commit and push: git add topics.json && git commit -m "Add topic: ' + title + '" && git push');
    console.log('3. The topic will be randomly selected for generation\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Show existing tag suggestions
async function showTagSuggestions() {
  const topics = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf-8'));
  const tagCounts = {};

  topics.forEach(topic => {
    topic.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  console.log('\n📊 Most used tags (for consistency):');
  sortedTags.forEach(([tag, count]) => {
    console.log(`   ${tag} (${count})`);
  });
  console.log('');
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node scripts/add-topic.js [options]

Options:
  --tags, -t    Show most used tags
  --help, -h    Show this help message

Interactive mode (default):
  Prompts for title, organization, category, official source, and tags
`);
  process.exit(0);
}

if (args.includes('--tags') || args.includes('-t')) {
  showTagSuggestions();
  process.exit(0);
}

// Run interactive mode
addTopic();
