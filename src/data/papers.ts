import { Paper, ThemeItem } from "@/types";

export const themes: ThemeItem[] = [
  {
    name: "Human-AI Interaction",
    children: [
      {
        name: "Transparency & Trust",
        children: [
          { name: "Citation Systems" },
          { name: "Explainable AI" },
        ],
      },
      { name: "User Control & Agency" },
      { name: "AI-Enhanced Research" },
    ],
  },
  { name: "Collaborative AI Systems" },
  { name: "Conversational AI" },
  { name: "AI UX Frameworks" },
];

export const papers: Paper[] = [
  {
    id: "clip-2021",
    title: "Learning Transferable Visual Models From Natural Language Supervision",
    authors: [
      "Alec Radford", "Jong Wook Kim", "Chris Hallacy", "Aditya Ramesh",
      "Gabriel Goh", "Sandhini Agarwal", "Girish Sastry", "Amanda Askell",
      "Pamela Mishkin", "Jack Clark", "Gretchen Krueger", "Ilya Sutskever",
    ],
    abstract: `State-of-the-art computer vision systems are trained to predict a fixed set of predetermined object categories. This restricted form of supervision limits their generality and usability since additional labeled data is needed to specify any other visual concept. Learning directly from raw text about images is a promising alternative which leverages a much broader source of supervision. We demonstrate that the simple pre-training task of predicting which caption goes with which image is an efficient and scalable way to learn SOTA image representations from scratch on a dataset of 400 million (image, text) pairs collected from the internet. After pre-training, natural language is used to reference learned visual concepts (or describe new ones) enabling zero-shot transfer of the model to downstream tasks.`,
    body: [
      `We study the performance of this approach by benchmarking on over 30 different existing computer vision datasets, spanning tasks such as OCR, action recognition in videos, geo-localization, and many types of fine-grained object classification. The model transfers non-trivially to most tasks and is often competitive with a fully supervised baseline without the need for any dataset specific training. For instance, we match the accuracy of the original ResNet-50 on ImageNet zero-shot without needing to use any of the 1.28 million training examples it was trained on.`,
      `Pre-training methods which learn directly from raw text have revolutionized NLP over the last few years (Dai & Le, 2015; Peters et al., 2018; Howard & Ruder, 2018; Radford et al., 2018; Devlin et al., 2018; Raffel et al., 2019). Task-agnostic objectives such as autoregressive and masked language modeling have scaled across many orders of magnitude in compute, model capacity, and data, steadily improving capabilities.`,
      `The development of "text-to-text" as a standardized input-output interface has enabled task-agnostic architectures to zero-shot transfer to downstream datasets removing the need for specialized output heads or dataset specific customization. Flagship systems like GPT-3 (Brown et al., 2020) are now competitive across many tasks with bespoke models while requiring little to no dataset specific training data.`,
      `These results suggest that the aggregate supervision accessible to modern pre-training methods within web-scale collections of text surpasses that of high-quality crowd-labeled NLP datasets. However, in other fields such as computer vision it is still standard practice to pre-train models on crowd-labeled datasets such as ImageNet (Deng et al., 2009). Could scalable pre-training methods which learn directly from web text result in a similar breakthrough in computer vision? Prior work is encouraging.`,
    ],
    date: "2021-02-26",
    theme: "Human-AI Interaction",
    subtheme: "Transparency & Trust",
    tags: ["Vision", "NLP", "Zero-shot", "CLIP"],
    citationCount: 12847,
  },
  {
    id: "attention-2017",
    title: "Attention Is All You Need",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez", "Łukasz Kaiser", "Illia Polosukhin"],
    abstract: `The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.`,
    body: [
      `Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.`,
      `Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8.`,
    ],
    date: "2017-06-12",
    theme: "Collaborative AI Systems",
    tags: ["Transformer", "Attention", "NLP"],
    citationCount: 98234,
  },
  {
    id: "gpt4-2023",
    title: "GPT-4 Technical Report",
    authors: ["OpenAI"],
    abstract: `We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and produce text outputs. While less capable than humans in many real-world scenarios, GPT-4 exhibits human-level performance on various professional and academic benchmarks.`,
    body: [
      `GPT-4 is a Transformer-based model pre-trained to predict the next token in a document. The post-training alignment process results in improved performance on measures of factuality and adherence to desired behavior.`,
      `A core component of this project was developing infrastructure and optimization methods that behave predictably across a wide range of scales.`,
    ],
    date: "2023-03-15",
    theme: "Conversational AI",
    tags: ["GPT-4", "LLM", "Multimodal"],
    citationCount: 5421,
  },
  {
    id: "rlhf-2022",
    title: "Training Language Models to Follow Instructions with Human Feedback",
    authors: ["Long Ouyang", "Jeff Wu", "Xu Jiang", "Diogo Almeida", "Carroll L. Wainwright", "Pamela Mishkin", "Chong Zhang", "Sandhini Agarwal"],
    abstract: `Making language models bigger does not inherently make them better at following a user's intent. Large language models can generate outputs that are untruthful, toxic, or simply not helpful to the user. We show an avenue for aligning language models with user intent on a wide range of tasks by fine-tuning with human feedback.`,
    body: [
      `Starting with a set of labeler-written prompts and prompts submitted through the OpenAI API, we collect a dataset of labeler demonstrations of the desired model behavior, which we use to fine-tune GPT-3 using supervised learning.`,
      `We then collect a dataset of rankings of model outputs, which we use to further fine-tune this supervised model using reinforcement learning from human feedback (RLHF).`,
    ],
    date: "2022-03-04",
    theme: "Human-AI Interaction",
    subtheme: "User Control & Agency",
    tags: ["RLHF", "Alignment", "InstructGPT"],
    citationCount: 7832,
  },
  {
    id: "diffusion-2022",
    title: "High-Resolution Image Synthesis with Latent Diffusion Models",
    authors: ["Robin Rombach", "Andreas Blattmann", "Dominik Lorenz", "Patrick Esser", "Björn Ommer"],
    abstract: `By decomposing the image formation process into a sequential application of denoising autoencoders, diffusion models (DMs) achieve state-of-the-art synthesis results on image data and beyond. By introducing cross-attention layers into the model architecture, we turn diffusion models into powerful and flexible generators for general conditioning inputs.`,
    body: [
      `Our latent diffusion models (LDMs) achieve new state-of-the-art scores for image inpainting and class-conditional image synthesis and highly competitive performance on various tasks, including text-to-image synthesis, unconditional image generation, and super-resolution.`,
    ],
    date: "2022-04-13",
    theme: "AI UX Frameworks",
    tags: ["Diffusion", "Stable Diffusion", "Image Generation"],
    citationCount: 6542,
  },
  {
    id: "chain-of-thought-2022",
    title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
    authors: ["Jason Wei", "Xuezhi Wang", "Dale Schuurmans", "Maarten Bosma", "Brian Ichter", "Fei Xia", "Ed Chi", "Quoc Le", "Denny Zhou"],
    abstract: `We explore how generating a chain of thought — a series of intermediate reasoning steps — significantly improves the ability of large language models to perform complex reasoning. We show that such reasoning abilities emerge naturally in sufficiently large language models via a simple method called chain-of-thought prompting.`,
    body: [
      `Experiments on three large language models show that chain-of-thought prompting improves performance on a range of arithmetic, commonsense, and symbolic reasoning tasks. The empirical gains can be striking. For instance, prompting a PaLM 540B with just eight chain-of-thought exemplars achieves state-of-the-art accuracy on the GSM8K benchmark of math word problems.`,
    ],
    date: "2022-01-28",
    theme: "Conversational AI",
    tags: ["Prompting", "Reasoning", "CoT"],
    citationCount: 4231,
  },
];

export const AI_RESPONSES: Record<string, string> = {
  default: `This paper presents a significant contribution to the field. The key insights include:

1. **Novel Architecture**: The proposed approach introduces a new way of thinking about the problem space [1].

2. **Scalability**: The method scales effectively across different data regimes and computational budgets [2].

3. **Zero-shot Transfer**: Perhaps most importantly, the model demonstrates strong zero-shot transfer capabilities [3].

The implications for future research are substantial, particularly in areas of multi-modal learning and efficient pre-training strategies.`,

  summary: `**Summary of Key Findings:**

The paper demonstrates that learning visual representations from natural language supervision can be both efficient and highly effective. Key takeaways:

• **400M image-text pairs** were used for pre-training
• **Zero-shot transfer** matches ResNet-50 on ImageNet
• **30+ benchmarks** evaluated across diverse vision tasks
• The approach eliminates the need for task-specific labeled data [4]

This work has had profound implications for the field, leading to models like DALL-E, Stable Diffusion, and modern vision-language systems [5].`,

  methodology: `**Methodology Analysis:**

The authors employ a contrastive learning framework with the following components:

1. **Image Encoder**: A Vision Transformer (ViT) or ResNet variant processes images into embedding vectors [1].

2. **Text Encoder**: A Transformer-based text encoder processes natural language descriptions [2].

3. **Contrastive Objective**: The model maximizes cosine similarity between matching image-text pairs while minimizing it for non-matching pairs [3].

4. **Scale**: Training on 400M pairs from the internet provides broad coverage of visual concepts [4].

The simplicity of this approach is its strength — no complex architectures or multi-stage training procedures are required.`,
};
