
export interface AIJobGenerationRequest {
    title: string;
    keywords?: string[];
    tone?: 'Professional' | 'Casual' | 'Technical';
}

export interface AIJobGenerationResponse {
    description: string;
    requirements: string[];
    suggestedType: string;
    suggestedDepartment: string;
}

export const generateJobDescription = async (request: AIJobGenerationRequest): Promise<AIJobGenerationResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { title, keywords = [] } = request;

    // Mock response generation based on title
    const isEngineering = title.toLowerCase().includes('engineer') || title.toLowerCase().includes('developer');
    const isDesign = title.toLowerCase().includes('design');
    const isMarketing = title.toLowerCase().includes('marketing');

    let description = `We are seeking a talented ${title} to join our dynamic team. In this role, you will be responsible for driving innovation and contributing to our core products. `;

    if (isEngineering) {
        description += "You will work closely with product managers and designers to build scalable font-end and back-end solutions. Code quality and performance optimization will be your daily focus.";
    } else if (isDesign) {
        description += "You will be the voice of the user, creating intuitive and beautiful interfaces that solve real customer problems.";
    } else if (isMarketing) {
        description += "You will lead our growth strategies, managing campaigns and analyzing metrics to optimize our market reach.";
    } else {
        description += "You will play a key role in our daily operations and strategic planning.";
    }

    if (keywords.length > 0) {
        description += `\n\nWe are looking for someone with experience in: ${keywords.join(', ')}.`;
    }

    const requirements = [
        "Bachelor's degree in a related field or equivalent experience.",
        "Strong communication and teamwork skills.",
        "Ability to work in a fast-paced environment.",
    ];

    if (isEngineering) {
        requirements.push("Proficiency in JavaScript/TypeScript and modern frameworks.");
        requirements.push("Experience with REST APIs and cloud services.");
    } else if (isDesign) {
        requirements.push("Proficiency in Figma and Adobe Creative Suite.");
        requirements.push("Strong portfolio demonstrating UX/UI skills.");
    }

    return {
        description,
        requirements,
        suggestedType: 'Full-time',
        suggestedDepartment: isEngineering ? 'Engineering' : isDesign ? 'Product' : isMarketing ? 'Marketing' : 'Operations'
    };
};
