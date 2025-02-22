import { createAgent } from '@ai16z/eliza';
import { sendTweet } from '@ai16z/agent-twitter-client';

// Step 1: Configure the AI agent
const agent = createAgent({
  name: 'Murakami AI',
  personality: {
    description: `$MURAKAMI - Takashi AI is an autonomous AI art project that generates Takashi Murakami-like paintings using his iconic Superflat style.`,
    creativity: 'high',
  },
});

// Step 2: Generate Murakami-style artwork
async function generateArt(prompt: string): Promise<{ imageUrl: string; description: string }> {
  const artPrompt = `Takashi Murakami-inspired Superflat art: ${prompt}`;
  const negativePrompt = 'No photorealism';

  // Generate artwork using the agent
  const generatedArt = await agent.generateImage({
    positivePrompt: artPrompt,
    negativePrompt,
    resolution: '5:4',
  });

  return {
    imageUrl: generatedArt.url,
    description: `
${generatedArt.name}

${generatedArt.description}

By @MurakamiAISol`,
  };
}

// Step 3: Post the artwork on Twitter
async function tweet() {
  try {
    const artDetails = await generateArt(agent.generatePrompt());

    // Compose the tweet
    const tweetContent = artDetails.description;

    // Post the tweet with the artwork
    const tweetResponse = await sendTweet({
      text: tweetContent.trim(),
      mediaUrl: artDetails.imageUrl,
    });

    console.log('Tweet posted successfully:', tweetResponse);
  } catch (error) {
    console.error('Failed to post to Twitter:', error);
  }
}

// Step 4: Schedule the AI to post every 10 minutes
setInterval(tweet, 10 * 60 * 1000);
