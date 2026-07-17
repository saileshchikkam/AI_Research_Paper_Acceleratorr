import { connectDB } from './server/config/database';
import { UserModel, IUser } from './server/models/User';
import { PaperModel, IPaper } from './server/models/Paper';
import { FolderModel, IFolder } from './server/models/Folder';
import { ChatSessionModel, IChatSession } from './server/models/ChatSession';
import { NoteModel, INote } from './server/models/Note';
import { FlashcardModel, IFlashcard } from './server/models/Flashcard';
import { QuizModel, IQuiz } from './server/models/Quiz';
import { LiteratureReviewModel, ILiteratureReview } from './server/models/LiteratureReview';
import { SavedCitationModel, ISavedCitation } from './server/models/SavedCitation';
import { StudyActivityModel, IStudyActivity } from './server/models/StudyActivity';
import { AiConfigModel } from './server/models/AiConfig';

import { 
  User, Paper, Folder, ChatSession, Note, Flashcard, 
  Quiz, LiteratureReview, SavedCitation, StudyActivity, DashboardMetrics 
} from './src/types';

// Note: Automatic database connection trigger removed. The database connection
// is now explicitly initialized and awaited on server startup in server.ts (Task 2).

// Initial Seeding Data Constants
const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Aarav Sharma',
    email: 'aarav@university.edu',
    role: 'student',
    enrolledAt: '2026-01-10T10:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'u-2',
    name: 'Dr. Meera Iyer',
    email: 'meera.iyer@university.edu',
    role: 'professor',
    enrolledAt: '2025-08-15T09:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'u-3',
    name: 'Rahul Patel',
    email: 'rahul.ml@tech.co',
    role: 'researcher',
    enrolledAt: '2025-11-20T14:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
  }
];

const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'f-1',
    name: 'Deep Learning Architectures',
    description: 'Core papers describing deep neural networks and attention mechanisms.',
    color: '#3B82F6',
    userId: 'u-1',
    createdAt: '2026-07-10T09:15:00Z'
  },
  {
    id: 'f-2',
    name: 'Natural Language Processing',
    description: 'Language modeling, pretraining, and tokenization techniques.',
    color: '#10B981',
    userId: 'u-1',
    createdAt: '2026-07-11T11:45:00Z'
  },
  {
    id: 'f-3',
    name: 'Information Retrieval & RAG',
    description: 'Papers on combining document search with generative models.',
    color: '#F59E0B',
    userId: 'u-1',
    createdAt: '2026-07-12T16:20:00Z'
  }
];

const ATTENTION_TEXT = `[Page 1: Title & Abstract]
Attention Is All You Need
Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin
Google Brain / Google Research / University of Toronto
Abstract: The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on WMT 2014 English-to-German translation, improving over the existing best results, including ensembles, by over 2 BLEU.

[Page 2: 1 Introduction]
1 Introduction
Recurrent neural networks (RNNs), particularly Long Short-Term Memory (LSTM) and gated recurrent neural networks, have been firmly established as state-of-the-art approaches in sequence modeling and transduction problems such as language modeling and machine translation. Numerous efforts have since continued to push the boundaries of recurrent language models and encoder-decoder architectures. However, their inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples. Recent work has achieved significant improvements in computational efficiency through factorization tricks and conditional computation, while the latter also improves model performance. However, the fundamental constraint of sequential computation remains, hindering massive scale pre-training.

[Page 3: 2 Literature Review]
2 Literature Review
The goal of reducing sequential computation also underpins the Extended Neural GPU, ByteNet, and ConvS2S, all of which use convolutional neural networks as basic building blocks, computing parallel representations for all input and output positions. In these models, the number of operations required to relate signals from two arbitrary input or output positions grows in the distance between positions, linearly for ConvS2S and logarithmically for ByteNet. This makes it more difficult to learn dependencies between distant positions. In the Transformer, this is reduced to a constant number of operations, albeit at the cost of reduced effective resolution due to averaging attention-weighted positions, an effect we counteract with Multi-Head Attention. Self-attention, also known as intra-attention, is an attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence. It has been used successfully in a variety of tasks including reading comprehension, abstractive summarization, textual entailment and learning task-independent sentence representations.

[Page 4: 3 Methodology]
3 Methodology
The Transformer follows the overall encoder-decoder architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder. The encoder maps an input sequence of symbol representations to a sequence of continuous representations. Given this representation, the decoder then generates an output sequence of symbols one token at a time. At each step, the model is auto-regressive, consuming the previously generated symbols as additional input when generating the next. To preserve sequence order, we inject positional encodings into the input embeddings. This is done by adding sine and cosine functions of different frequencies directly to the embedding vectors, enabling the model to distinguish relative token positions without relying on recurrence.

[Page 5: 3.1 Model Architecture]
3.1 Encoder and Decoder Stacks
Encoder: The encoder is composed of a stack of N = 6 identical layers. Each layer has two sub-layers. The first is a multi-head self-attention mechanism, and the second is a simple, position-wise fully connected feed-forward network. We employ a residual connection around each of the two sub-layers, followed by layer normalization. That is, the output of each sub-layer is LayerNorm(x + Sublayer(x)). To facilitate these residual connections, all sub-layers in the model, as well as the embedding layers, produce outputs of dimension d_model = 512.
Decoder: The decoder is also composed of a stack of N = 6 identical layers. In addition to the two sub-layers in each encoder layer, the decoder inserts a third sub-layer, which performs multi-head attention over the output stack of the encoder. Similar to the encoder, we employ residual connections around each of the sub-layers, followed by layer normalization. We also modify the self-attention sub-layer in the decoder stack to prevent positions from attending to subsequent positions. This masking, combined with the fact that the output embeddings are offset by one position, ensures that the predictions for position i can depend only on the known outputs at positions less than i.

[Page 6: 4 Dataset]
4 Dataset
We trained on the standard WMT 2014 English-German dataset consisting of about 4.5 million sentence pairs. Sentences were encoded using byte-pair encoding, which has a shared source-target vocabulary of about 37,000 tokens. For English-French, we used the significantly larger WMT 2014 English-French dataset consisting of 36 million sentence pairs and split tokens into a 32,000 word-piece vocabulary. Input and output tokens were mapped to dense vectors of dimension d_model = 512. Sentence pairs of similar lengths were batched together to optimize GPU memory utilization during training.

[Page 7: 5 Experiments]
5 Experiments
We trained our models on one machine with 8 NVIDIA P100 GPUs. For our base models, each training step took about 0.4 seconds. We trained the base models for a total of 100,000 steps or 12 hours. For our large models, which had d_model = 1024, h = 16 heads, and d_ff = 2048, each step took about 1.0 second, and we trained them for 300,000 steps (3.5 days). We used the Adam optimizer with a custom learning rate schedule that increases the learning rate linearly for the first 4,000 warmup steps, and decreases it thereafter proportionally to the inverse square root of the step number. We applied residual dropout, label smoothing of 0.1, and attention dropout to prevent overfitting.

[Page 8: 6 Results]
6 Results
On the WMT 2014 English-to-German translation task, the Transformer (large) outperforms the best previously reported models (including ensembles) by more than 2.0 BLEU, establishing a new state-of-the-art of 28.4 BLEU score. The base model also performs exceptionally well, outperforming all previously published results and ensembles at a fraction of the training cost of any of the baseline models. On the English-to-French translation task, our large model achieves a BLEU score of 41.8, outperforming all previously published single models at less than 1/4 the training cost of the previous state-of-the-art model.

[Page 9: 7 Discussion]
7 Discussion
There are three main motivations for using self-attention rather than recurrent or convolutional layers for sequence transduction. One is the total computational complexity per layer. Another is the amount of computation that can be parallelized, measured by the minimum number of sequential operations required. The third is the path length between long-range dependencies in the network. Learning long-range dependencies is a key challenge in many sequence transduction tasks. One key factor affecting the ability to learn such dependencies is the path length forward and backward signals must travel. The shorter the path between any position in the input and output sequences, the easier it is for the network to learn long-range dependencies. In self-attention, this path is a constant O(1) operations, compared to O(N) for recurrent layers and O(log_k(N)) for tree-structured networks.

[Page 10: 8 Limitations]
8 Limitations
Despite its groundbreaking success, the self-attention mechanism in the standard Transformer exhibits a quadratic computational and memory complexity of O(N^2) with respect to the input sequence length N. This is because every token must compute an attention score with every other token in the sequence. For long sequences, such as books, high-resolution images, or extensive genomic sequences, this quadratic bottleneck quickly leads to out-of-memory errors on standard accelerator hardware. Furthermore, the model has no built-in inductive bias for localized structures, requiring significantly larger training data to learn basic sequence ordering compared to recurrent models.

[Page 11: 9 Future Work]
9 Future Work
In the future, we plan to extend the Transformer to problems involving other input modalities besides text, such as images, audio, and video. We are also highly interested in investigating local, restricted attention mechanisms to efficiently handle extremely long input sequences. This includes sparse attention matrices and linear-time attention approximations. Another exciting avenue of research is exploring the applicability of the Transformer architecture to reinforcement learning and multi-agent control environments, where multi-step planning and policy representation can benefit from the parallelized self-attention mechanism.

[Page 12: 10 Conclusion]
10 Conclusion
We have presented the Transformer, the first sequence transduction model based entirely on attention, replacing recurrent and convolutional layers with multi-headed self-attention. The Transformer can be trained significantly faster than architectures based on recurrent or convolutional layers. On both WMT 2014 English-to-German and English-to-French translation tasks, we achieved a new state of the art, outperforming previous models by substantial margins. In addition, the Transformer generalizes exceptionally well to other tasks, such as English constituency parsing, demonstrating its versatility as a general-purpose sequence learning framework.

[Page 13: 11 References]
11 References
1. Bahdanau, D., Cho, K. and Bengio, Y., 2014. Neural machine translation by jointly learning to align and translate. arXiv:1409.0473.
2. Devlin, J. et al., 2018. BERT: Pre-training of deep bidirectional transformers for language understanding. arXiv:1810.04805.
3. Hochreiter, S. and Schmidhuber, J., 1997. Long short-term memory. Neural computation, 9(8), pp.1735-1780.
4. Vaswani, A. et al., 2017. Attention is all you need. Advances in Neural Information Processing Systems, 30, pp.5998-6008.
5. Sutskever, I., Vinyals, O. and Le, Q.V., 2014. Sequence to sequence learning with neural networks. Advances in Neural Information Processing Systems, pp.3101-3109.`;

const BERT_TEXT = `[Page 1: Title & Abstract]
BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding
Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova
Google AI Language
Abstract: We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers. As a result, the pre-trained BERT model can be fine-tuned with just one additional output layer to create state-of-the-art models for a wide range of tasks, such as question answering and language inference, without substantial task-specific architecture modifications. BERT is conceptually simple and empirically powerful, obtaining new state-of-the-art results on eleven natural language processing tasks.

[Page 2: 1 Introduction]
1 Introduction
Language model pre-training has been shown to be highly effective for improving many natural language processing tasks. These include sentence-level tasks such as natural language inference and paraphrasing, by predicting the relationships between sentences, as well as token-level tasks such as named entity recognition and question answering, where models must produce fine-grained output at the token level. There are two existing strategies for applying pre-trained language representations to downstream tasks: feature-based and fine-tuning. The feature-based approach, such as ELMo, uses task-specific architectures that include pre-trained representations as additional features. The fine-tuning approach, such as the Generative Pre-trained Transformer (GPT), introduces minimal task-specific parameters, and is trained on the downstream tasks by simply fine-tuning all pre-trained parameters.

[Page 3: 2 Literature Review]
2 Literature Review
A major limitation of current pre-trained language representations is that standard language models are unidirectional, and this limits the choice of architectures that can be used during pre-training. For example, in OpenAI GPT, the authors use a left-to-right architecture, where every token can only attend to previous tokens in the self-attention layers of the Transformer. Such restrictions are sub-optimal for sentence-level tasks, and could be very harmful when applying fine-tuning based approaches to token-level tasks such as question answering, where it is crucial to incorporate context from both directions. In this paper, we improve the fine-tuning based approaches by proposing BERT: Bidirectional Encoder Representations from Transformers. BERT alleviates the unidirectionality constraint by using a Masked Language Model (MLM) pre-training objective.

[Page 4: 3 Methodology]
3 Methodology
We introduce BERT and its detailed implementation in this section. There are two steps in our framework: pre-training and fine-tuning. During pre-training, the model is trained on unlabeled data over different pre-training tasks. For fine-tuning, the BERT model is first initialized with the pre-trained parameters, and all of the parameters are fine-tuned jointly using labeled data from the downstream tasks. Each downstream task has separate fine-tuned models, even though they are initialized with the same pre-trained parameters. A distinctive feature of BERT is its unified architecture across different tasks. There is minimal discrepancy between the pre-trained architecture and the final downstream architecture, making transfer learning seamless.

[Page 5: 3.1 Model Architecture]
3.1 Model Architecture
BERT's model architecture is a multi-layer bidirectional Transformer encoder based on the original design described in Vaswani et5 al. (2017). We denote the number of layers (i.e., Transformer blocks) as L, the hidden size as H, and the number of self-attention heads as A. We primarily report results on two model sizes:
BERT-Base: L = 12, H = 768, A = 12, Total Parameters = 110M. This was designed to have an identical model size to OpenAI GPT for comparison.
BERT-Large: L = 24, H = 1024, A = 16, Total Parameters = 340M.
For our input representation, we use the WordPiece embeddings with a 30,000 token vocabulary. The first token of every sequence is always a special classification token ([CLS]). The final hidden state corresponding to this token is used as the aggregate sequence representation for classification tasks. Sentence pairs are packed together into a single sequence. We differentiate the sentences by adding a special token ([SEP]) between them and by adding a learned segment embedding to every token.

[Page 6: 4 Dataset]
4 Dataset
For pre-training, we use the BooksCorpus consisting of 800 million words, and English Wikipedia consisting of 2,500 million words. For Wikipedia, we extract only the text passages and ignore lists, tables, and headers. It is critical to use a document-level corpus rather than a shuffled sentence-level corpus like the Billion Word Benchmark in order to extract long contiguous sequences. This document-level structure enables the model to learn complex semantic representations and sentence-to-sentence relationships across paragraph boundaries, which is essential for reading comprehension tasks.

[Page 7: 5 Experiments Setup]
5 Experiments Setup
We pre-train BERT-Base using 16 TPU chips (4 Cloud TPU pods) and BERT-Large using 64 TPU chips for a total of 1,000,000 steps, which takes approximately 4 days. The pre-training learning rate is set to 1e-4 with a linear warmup over the first 10,000 steps. We use a batch size of 256 sequences, where each sequence has a length of 512 tokens. We pre-train with two main objectives:
1. Masked Language Model (MLM): We mask 15% of all WordPiece tokens in each sequence at random. Out of these, 80% are replaced with [MASK], 10% are replaced with a random token, and 10% are left unchanged.
2. Next Sentence Prediction (NSP): To train a model that understands sentence relationships, we pre-train for a binarized next sentence prediction task. 50% of the time B is the actual next sentence that follows A, and 50% of the time it is a random sentence from the corpus.

[Page 8: 6 Results]
6 Results
BERT obtains state-of-the-art results across eleven natural language processing benchmarks. On the GLUE (General Language Understanding Evaluation) benchmark, BERT-Large achieves a score of 80.5%, outperforming the previous state-of-the-art by 7.6% absolute. On the Stanford Question Answering Dataset (SQuAD v1.1), BERT-Large achieves a 93.2% F1 score, outperforming the previous best ensemble model by 1.5%. On SQuAD v2.0, BERT-Large achieves an 83.1% F1 score, representing a massive 5.1% absolute improvement over previous models. BERT also demonstrates exceptional generalizability on the MultiNLI and CoLA benchmarks.

[Page 9: 7 Discussion]
7 Discussion
The primary reason for BERT's superior performance is its deep bidirectional representation. Traditional pre-trained models are unidirectional, which restricts the self-attention mechanism to attending only to past tokens. By employing the Masked Language Model (MLM) pre-training objective, we enable the Transformer layers to condition on both left and right context simultaneously. This bidirectional representation is particularly crucial for token-level tasks like Question Answering, where predicting a token relies heavily on its surrounding context from both sides. Our ablation studies demonstrate that removing either the MLM objective or the Next Sentence Prediction (NSP) task results in a significant drop in downstream performance.

[Page 10: 8 Limitations]
8 Limitations
One notable limitation of BERT is the discrepancy between the pre-training and fine-tuning phases. The special [MASK] token, which is used during pre-training to enable bidirectional context representations, never appears during actual fine-tuning or inference. This mismatch can lead to a slight sub-optimality in representation learning. To mitigate this, we do not always replace masked words with [MASK], but the discrepancy is not entirely resolved. Another major limitation is the high computational cost required for pre-training, which demands dozens of TPU chips for several days, restricting pre-training iterations to large industrial labs.

[Page 11: 9 Future Work]
9 Future Work
In future work, we plan to investigate pre-training methods that can learn bidirectional representations without introducing artificial tokens like [MASK] during pre-training. We are also interested in exploring lightweight or distilled versions of BERT (such as DistilBERT or ALBERT) to enable efficient execution on edge devices and mobile browsers. Furthermore, we plan to investigate the applicability of bidirectional pre-training to multi-modal representations, combining text representations with vision or speech embeddings in a single unified Transformer stack.

[Page 12: 10 Conclusion]
10 Conclusion
We have introduced BERT, a deeply bidirectional language representation model that pre-trains a multi-layer Transformer encoder. Our results demonstrate that bidirectional pre-training is highly effective, enabling a single pre-trained model to achieve state-of-the-art results on a wide range of NLP tasks through simple fine-tuning. By removing the unidirectionality constraint, BERT represents a major advancement in pre-trained language representation, proving that deep bidirectional conditioning is superior to standard unidirectional models.

[Page 13: 11 References]
11 References
1. Devlin, J. et al., 2018. BERT: Pre-training of deep bidirectional transformers for language understanding. arXiv:1810.04805.
2. Peters, M.E. et al., 2018. Deep contextualized word representations. arXiv:1802.05365.
3. Radford, A. et al., 2018. Improving language understanding by generative pre-training. OpenAI.
4. Vaswani, A. et al., 2017. Attention is all you need. Advances in Neural Information Processing Systems, 30, pp.5998-6008.
5. Wang, A. et al., 2018. GLUE: A multi-task benchmark and analysis platform for natural language understanding. arXiv:1804.07461.`;

const RAG_TEXT = `[Page 1: Title & Abstract]
Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
Patrick Lewis, Ethan Perez, Aleksandara Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, Douwe Kiela
Facebook AI Research / University College London / New York University
Abstract: We introduce retrieval-augmented generation (RAG) models for knowledge-intensive NLP tasks—models which combine pre-trained parametric and non-parametric memory. RAG can be fine-tuned end-to-end, showing strong performance across open-domain QA and jeopardy generation. Unlike traditional language models that store factual knowledge entirely in their neural weights, RAG retrieves relevant document passages dynamically from an external index during generation. This hybrid approach enables RAG to generate responses that are highly factual, specific, and grounded, while allowing users to inspect the non-parametric sources directly.

[Page 2: 1 Introduction]
1 Introduction
Pre-trained language models have been shown to store a wealth of factual knowledge in their parameters, and can be fine-tuned to achieve state-of-the-art results on downstream tasks. However, their ability to access and precisely manipulate knowledge is still limited, and they often struggle with knowledge-intensive tasks. In particular, closed-book parametric models are prone to hallucinating plausible-sounding but false statements, cannot easily update their internal knowledge base without expensive parameter retraining, and cannot provide clear citations or provenance for their generated outputs. To address these limitations, we propose Retrieval-Augmented Generation (RAG).

[Page 3: 2 Literature Review]
2 Literature Review
Our work builds upon recent advances in dense retrieval and open-domain question answering. Standard open-domain QA systems often rely on a retrieve-and-read pipeline, where a sparse retriever (like BM25) or a dense retriever (like Dense Passage Retrieval) fetches relevant passages, and a reader model extracts the correct answer span. However, extracting answers is limited to exact text matches and cannot easily synthesize information or generate abstractive summaries. By integrating dense retrieval directly with an autoregressive sequence-to-sequence model, our RAG framework combines the flexibility of generation with the grounding capabilities of retrieval.

[Page 4: 3 Methodology]
3 Methodology
We study a general Retrieval-Augmented Generation (RAG) architecture. The model takes a prompt x and retrieves a set of latent documents z. It then uses these documents to generate the target sequence y. Our model consists of two primary components:
1. Retriever: A Dense Passage Retriever (DPR) parameterized by a bi-encoder neural network. DPR maps the query and documents into a shared continuous vector space and retrieves the top-K documents with the highest inner product.
2. Generator: A pre-trained sequence-to-sequence model (BART) that receives the retrieved documents concatenated with the original query x and generates the target sequence y.

[Page 5: 3.1 Model Architecture]
3.1 Model Architecture
We propose two formulations of RAG:
RAG-Sequence: The model retrieves K documents once and uses the same retrieved documents to generate the entire target sequence. The probability of the sequence is computed by marginalizing over the retrieved documents.
RAG-Token: The model retrieves a set of documents and can attend to different documents for each generated token in the target sequence. This allows the model to synthesize details from multiple distinct sources dynamically during generation.
For both models, we initialize the retriever with a pre-trained DPR model and the generator with a pre-trained BART-Large model (400M parameters). We optimize the entire system end-to-end using standard gradient descent.

[Page 6: 4 Dataset]
4 Dataset
We use the Wikipedia dump from December 2018 as our primary non-parametric document index. The corpus is split into 21 million non-overlapping 100-word blocks or passages. Each passage is encoded into a 768-dimensional vector using DPR's document encoder, creating a dense vector index. To facilitate fast retrieval during training and inference, we construct a hierarchical navigable small world (HNSW) index using the FAISS library, which enables sub-millisecond similarity search over millions of vectors.

[Page 7: 5 Experiments Setup]
5 Experiments Setup
We train RAG on four knowledge-intensive datasets: TriviaQA, WebQuestions, CuratedTREC, and Jeopardy Question Generation. We use a retrieval size of K = 5 or K = 10 documents. We optimize the model using Adam with a learning rate of 3e-5 for the generator and 1e-5 for the retriever. We train with a batch size of 150 on 8 NVIDIA V100 GPUs for approximately 2 days. The dense retriever is fine-tuned jointly with the sequence generator, allowing the retrieval representations to adapt to the generation task.

[Page 8: 6 Results]
6 Results
RAG models establish a new state-of-the-art on open-domain question answering benchmarks, outperforming both traditional retrieve-and-extract models and large closed-book parametric models (such as T5-11B). On TriviaQA, RAG-Sequence achieves 68.0% accuracy, outperforming BART by over 15% absolute. On Jeopardy, RAG-Token generates responses that are significantly more factual and specific than BART, and achieves a high human evaluation score. On CuratedTREC, RAG achieves 44.5% accuracy, establishing a new state-of-the-art.

[Page 9: 7 Discussion]
7 Discussion
Our experiments demonstrate that combining parametric and non-parametric memory is highly effective for knowledge-intensive NLP tasks. Non-parametric memory (the Wikipedia document index) provides a vast, easily updatable repository of facts, while parametric memory (the sequence-to-sequence model weights) provides a flexible, fluent generation engine. RAG models can update their knowledge base instantly by swap-replacing the document index, without requiring any parameter retraining. This offers a massive advantage over standard closed-book language models.

[Page 10: 8 Limitations]
8 Limitations
A primary limitation of RAG is the increased inference latency and computational overhead. Performing dense vector retrieval and ranking over millions of passages before running the neural generation model adds significant delay, which can impact real-time streaming applications. Furthermore, RAG models can be highly sensitive to retrieval noise; if the retriever fetches irrelevant or incorrect passages, the generator can easily incorporate these false details into the final generated response, leading to grounded hallucinations.

[Page 11: 9 Future Work]
9 Future Work
In future work, we plan to explore multi-step or recursive retrieval architectures, where the model can retrieve documents, generate an intermediate reasoning step, and then retrieve additional documents based on that step. We are also interested in scaling the document index to include massive heterogeneous web corpora, moving beyond clean Wikipedia passages. Another exciting avenue of research is optimizing retrieval latency through vector quantization and hardware-accelerated similarity search engines.

[Page 12: 10 Conclusion]
10 Conclusion
We have presented Retrieval-Augmented Generation (RAG), a hybrid architecture combining parametric and non-parametric memory. Our results demonstrate that RAG models achieve state-of-the-art results on open-domain question answering, producing answers that are more factual, specific, and grounded than standard parametric models. By enabling end-to-end differentiable retrieval and generation, RAG represents a powerful paradigm for building factually reliable, interpretable, and easily updatable language models.

[Page 13: 11 References]
11 References
1. Lewis, P. et al., 2020. Retrieval-augmented generation for knowledge-intensive nlp tasks. arXiv:2005.11401.
2. Karpukhin, V. et5 al., 2020. Dense passage retrieval for open-domain question answering. arXiv:2004.04906.
3. Lewis, M. et al., 2019. BART: Denoising sequence-to-sequence pre-training for natural language generation, translation, and comprehension. arXiv:1910.13461.
4. Raffel, C. et al., 2019. Exploring the limits of transfer learning with a unified text-to-text transformer. arXiv:1910.10683.
5. Robertson, S. and Zaragoza, H., 2009. The probabilistic relevance framework: BM25 and beyond. Foundations and Trends in Information Retrieval, 3(4), pp.333-389.`;

const INITIAL_PAPERS: Paper[] = [
  {
    id: 'p-1',
    title: 'Attention Is All You Need',
    authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin',
    journal: 'Advances in Neural Information Processing Systems (NeurIPS)',
    year: 2017,
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    folderId: 'f-1',
    isBookmarked: true,
    uploadedAt: '2026-07-10T10:00:00Z',
    fileType: 'application/pdf',
    size: '2.1 MB',
    content: ATTENTION_TEXT,
    pages: ATTENTION_TEXT.split('[Page ').filter(Boolean).map(p => {
      const closingBracketIndex = p.indexOf(']');
      return p.substring(closingBracketIndex + 1).trim();
    }),
    citations: {
      apa: 'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30, 5998–6008.',
      mla: 'Vaswani, Ashish, et al. "Attention is all you need." Advances in Neural Information Processing Systems, vol. 30, 2017, pp. 5998-6008.',
      chicago: 'Vaswani, Ashish, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, and Illia Polosukhin. "Attention is all you need." Advances in Neural Information Processing Systems 30 (2017): 5998-6008.',
      harvard: 'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A.N., Kaiser, Ł. and Polosukhin, I., 2017. Attention is all you need. Advances in Neural Information Processing Systems, 30, pp. 5998-6008.',
      bibtex: `@inproceedings{vaswani2017attention,
  title={Attention is all you need},
  author={Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N and Kaiser, {\\L}ukasz and Polosukhin, Illia},
  booktitle={Advances in Neural Information Processing Systems},
  volume={30},
  pages={5998--6008},
  year={2017}
}`
    },
    readingProgress: 85,
    summary: {
      coreProblem: "The core problem addressed is the sequential nature of RNNs/LSTMs, which prevents parallelization during training. This creates a computational bottleneck, especially for long sequences.",
      methodology: "The paper proposes the Transformer, an architecture based entirely on self-attention mechanisms. It dispenses with recurrence and convolutions, using multi-head self-attention, layer normalization, residual connections, and positional encodings.",
      findings: "The Transformer achieves state-of-the-art results on WMT 2014 English-to-German (28.4 BLEU) and English-to-French (41.8 BLEU) tasks. It trains significantly faster, requiring only a fraction of the computation.",
      limitations: "A key limitation of standard self-attention is its quadratic O(N^2) time and memory complexity with respect to the sequence length N, making it expensive for ultra-long documents."
    },
    insights: {
      keyInnovations: [
        "Replacing recurrent layers entirely with multi-head self-attention.",
        "Constant O(1) path length for relating arbitrary positions in a sequence.",
        "Position-wise feed-forward networks applied to each sequence token independently."
      ],
      novelContributions: [
        "The first sequence transduction model relying entirely on self-attention.",
        "Introduction of scaled dot-product attention to stabilize softmax gradients.",
        "Introduction of sinusoidal positional encodings to preserve sequence order."
      ],
      strengths: [
        "Massive parallelization during training, drastically reducing training duration.",
        "Superior translation quality on standard WMT benchmarks.",
        "Strong generalizability to other NLP tasks like constituency parsing."
      ],
      weaknesses: [
        "Quadratic memory complexity O(N^2) makes long-document modeling difficult.",
        "Lacks inductive biases of CNNs/RNNs, requiring large datasets to generalize.",
        "Requires complex learning rate scheduling and warmups to converge."
      ],
      researchGap: [
        "Lack of linear-time attention approximations for extremely long inputs.",
        "No natural way to integrate structured knowledge graphs into self-attention stacks.",
        "Sensitivity of multi-head projections to random seed initialization during pre-training."
      ],
      futureScope: [
        "Extending the self-attention architecture to other modalities like image, speech, and video.",
        "Developing local, restricted sparse attention mechanisms to run on edge devices.",
        "Exploring applicability of the Transformer to reinforcement learning and multi-step planning."
      ]
    }
  },
  {
    id: 'p-2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
    journal: 'Association for Computational Linguistics (NAACL-HLT)',
    year: 2019,
    abstract: 'We introduce a new language representation model called BERT. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.',
    folderId: 'f-2',
    isBookmarked: false,
    uploadedAt: '2026-07-11T12:00:00Z',
    fileType: 'application/pdf',
    size: '1.4 MB',
    content: BERT_TEXT,
    pages: BERT_TEXT.split('[Page ').filter(Boolean).map(p => {
      const closingBracketIndex = p.indexOf(']');
      return p.substring(closingBracketIndex + 1).trim();
    }),
    citations: {
      apa: 'Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2018). BERT: Pre-training of deep bidirectional transformers for language understanding. arXiv preprint arXiv:1810.04805.',
      mla: 'Devlin, Jacob, et al. "BERT: Pre-training of deep bidirectional transformers for language understanding." arXiv preprint arXiv:1810.04805 (2018).',
      chicago: 'Devlin, Jacob, Ming-Wei Chang, Kenton Lee, and Kristina Toutanova. "BERT: Pre-training of deep bidirectional transformers for language understanding." arXiv preprint arXiv:1810.04805 (2018).',
      harvard: 'Devlin, J., Chang, M.W., Lee, K. and Toutanova, K., 2018. BERT: Pre-training of deep bidirectional transformers for language understanding. arXiv preprint arXiv:1810.04805.',
      bibtex: `@article{devlin2018bert,
  title={BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding},
  author={Devlin, Jacob and Chang, Ming-Wei and Lee, Kenton and Toutanova, Kristina},
  journal={arXiv preprint arXiv:1810.04805},
  year={2018}
}`
    },
    readingProgress: 40,
    summary: {
      coreProblem: "Standard pre-trained language models are unidirectional (left-to-right), which is sub-optimal for sentence-level and token-level tasks (e.g. QA) where context from both directions is crucial.",
      methodology: "Proposes BERT, which stands for Bidirectional Encoder Representations from Transformers. Alleviates bidirectionality constraints using a Masked Language Model (MLM) objective and Next Sentence Prediction (NSP).",
      findings: "BERT achieves state-of-the-art results across eleven NLP tasks, scoring 80.5% on GLUE, 93.2% F1 on SQuAD v1.1, and 83.1% F1 on SQuAD v2.0.",
      limitations: "A mismatch exists between pre-training and fine-tuning because the special [MASK] token never appears during fine-tuning. Pre-training is also computationally expensive."
    },
    insights: {
      keyInnovations: [
        "Deep bidirectional Transformer representation learned via joint masking.",
        "Introduction of the binarized Next Sentence Prediction (NSP) pre-training task.",
        "Unified architecture that bridges pre-training and downstream fine-tuning seamless."
      ],
      novelContributions: [
        "Alleviation of the unidirectionality bottleneck in self-attention encoder representations.",
        "WordPiece segmentation for handling out-of-vocabulary terms efficiently.",
        "Special [CLS] classification token to capture unified sequence embeddings."
      ],
      strengths: [
        "Extremely strong transfer learning performance on downstream tasks with zero task-specific modifications.",
        "Deeply bidirectional context capture across all layers.",
        "Proven empirical superiority on structured NLP benchmarks."
      ],
      weaknesses: [
        "Discrepancy caused by [MASK] token absence during downstream fine-tuning.",
        "Very high computational costs requiring substantial TPU hardware.",
        "High latency in real-time inference because of model parameter size (340M)."
      ],
      researchGap: [
        "Absence of pre-training methods that avoid artificial masking tokens.",
        "Vulnerability of model weights to adversarial context perturbations.",
        "Inefficient computation of attention weights across long documents."
      ],
      futureScope: [
        "Investigating lighter distilled versions like DistilBERT and ALBERT for edge devices.",
        "Extending deep bidirectional pre-training to multi-modal video and speech systems.",
        "Improving MLM representations through span-masking and dynamic masking schedules."
      ]
    }
  },
  {
    id: 'p-3',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    authors: 'Patrick Lewis, Ethan Perez, Aleksandara Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, Douwe Kiela',
    journal: 'Advances in Neural Information Processing Systems (NeurIPS)',
    year: 2020,
    abstract: 'We introduce retrieval-augmented generation (RAG) models for knowledge-intensive NLP tasks—models which combine pre-trained parametric and non-parametric memory. RAG can be fine-tuned end-to-end, showing strong performance across open-domain QA and jeopardy generation.',
    folderId: 'f-3',
    isBookmarked: true,
    uploadedAt: '2026-07-12T17:00:00Z',
    fileType: 'application/pdf',
    size: '3.5 MB',
    content: RAG_TEXT,
    pages: RAG_TEXT.split('[Page ').filter(Boolean).map(p => {
      const closingBracketIndex = p.indexOf(']');
      return p.substring(closingBracketIndex + 1).trim();
    }),
    citations: {
      apa: 'Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., ... & Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive nlp tasks. Advances in Neural Information Processing Systems, 33, 9459-9474.',
      mla: 'Lewis, Patrick, et al. "Retrieval-augmented generation for knowledge-intensive nlp tasks." Advances in Neural Information Processing Systems, vol. 33, 2020, pp. 9459-9474.',
      chicago: 'Lewis, Patrick, Ethan Perez, Aleksandara Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Küttler, et al. "Retrieval-augmented generation for knowledge-intensive nlp tasks." Advances in Neural Information Processing Systems 33 (2020): 9459-9474.',
      harvard: 'Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W.T., Rocktäschel, T. and Riedel, S., 2020. Retrieval-augmented generation for knowledge-intensive nlp tasks. Advances in Neural Information Processing Systems, 33, pp. 9459-9474.',
      bibtex: `@article{lewis2020retrieval,
  title={Retrieval-augmented generation for knowledge-intensive nlp tasks},
  author={Lewis, Patrick and Perez, Ethan and Piktus, Aleksandara and Petroni, Fabio and Karpukhin, Vladimir and Goyal, Naman and K{\\"u}ttler, Heinrich and Lewis, Mike and Yih, Wen-tau and Rockt{\\"a}schel, Tim and others},
  journal={Advances in Neural Information Processing Systems},
  volume={33},
  pages={9459--9474},
  year={2020}
}`
    },
    readingProgress: 100,
    summary: {
      coreProblem: "Closed-book parametric models struggle with knowledge-intensive tasks, are prone to hallucinating facts, cannot update world knowledge easily, and lack proper citation provenance.",
      methodology: "Proposes Retrieval-Augmented Generation (RAG), which integrates a Dense Passage Retriever (DPR) bi-encoder with an autoregressive sequence-to-sequence generator (BART) optimized end-to-end.",
      findings: "RAG establishes a new state-of-the-art on TriviaQA (68.0%) and Jeopardy generation, outperforming larger closed-book models like T5.",
      limitations: "RAG exhibits high latency and computational overhead due to search-index lookups. It is also sensitive to retrieval noise, which can cause grounded hallucinations."
    },
    insights: {
      keyInnovations: [
        "Synergistic integration of parametric memory (BART) and non-parametric memory (Wikipedia DPR vector index).",
        "Differentiable joint optimization of retrieval bi-encoders and sequence-to-sequence generators.",
        "Dynamic attention mechanisms over multiple retrieved documents (RAG-Token)."
      ],
      novelContributions: [
        "First framework to backpropagate training loss end-to-end from generated text into dense passage representations.",
        "Demonstrated instant knowledge base updating by swap-replacing FAISS vector indices without retraining.",
        "Formulation of RAG-Sequence and RAG-Token sequence probability marginalization."
      ],
      strengths: [
        "Produces responses that are highly factual, specific, and grounded.",
        "Enables source interpretability, allowing users to inspect retrieved document chunks.",
        "Adaptable to different domains simply by plugging in a different corpus index."
      ],
      weaknesses: [
        "Vector retrieval similarity lookup increases real-time latency.",
        "Vulnerable to retrieval noise, which leads to grounded hallucinations.",
        "Joint optimization requires massive multi-GPU setups during training."
      ],
      researchGap: [
        "Lack of recursive multi-step retrieval to support multi-hop reasoning.",
        "No standard method for combining structured databases with unstructured text indexes.",
        "Difficulty handling conflicts between retrieved documents inside BART context."
      ],
      futureScope: [
        "Optimizing retrieval latency via vector quantization and hardware search accelerators.",
        "Expanding the non-parametric index to massive, heterogeneous web-scale corpora.",
        "Implementing multi-step recursive retrievers where the model queries sequentially."
      ]
    }
  }
];

const INITIAL_NOTES: Note[] = [
  {
    id: 'n-1',
    paperId: 'p-1',
    title: 'Transformer Core Mechanics',
    content: 'The core contribution is replacing LSTM sequential cells with Multi-Head Self-Attention. Key formulas:\n1. Scaled Dot-Product Attention: softmax(Q K^T / sqrt(d_k)) V\n2. d_model is 512, with h=8 heads. d_k = d_v = 64.\nThis allows constant path length for dependencies of arbitrary distance, resolving LSTM limitations.',
    updatedAt: '2026-07-10T10:30:00Z'
  },
  {
    id: 'n-2',
    paperId: 'p-2',
    title: 'BERT Objectives Analysis',
    content: 'BERT relies on two core pre-training objectives:\n- Masked Language Model (MLM): Masks 15% of words at random. Alleviates bidirectionality constraints.\n- Next Sentence Prediction (NSP): Binary classification (IsNext vs NotNext) to learn sentence-to-sentence relations. Critical for QA and Natural Language Inference.',
    updatedAt: '2026-07-11T12:45:00Z'
  }
];

const INITIAL_FLASHCARDS: Flashcard[] = [
  // --- PAPER 1: Attention Is All You Need ---
  {
    id: 'fc-1',
    paperId: 'p-1',
    question: 'What is the main limitation of LSTMs/RNNs that the Transformer solves?',
    answer: 'The inherently sequential nature of LSTMs/RNNs prevents parallelization during training, which becomes critical for long sequences. The Transformer allows fully parallel computations across all token positions.',
    difficulty: 'easy',
    category: 'Core Hypotheses'
  },
  {
    id: 'fc-2',
    paperId: 'p-1',
    question: 'Write the mathematical formula for Scaled Dot-Product Attention.',
    answer: 'Attention(Q, K, V) = softmax( (Q K^T) / sqrt(d_k) ) V',
    difficulty: 'medium',
    category: 'Methodology'
  },
  {
    id: 'fc-3',
    paperId: 'p-1',
    question: 'What is the role of Positional Encodings in the Transformer model?',
    answer: 'Since the Transformer lacks recurrence/convolutions, it has no inherent sense of sequence order. Positional Encodings are sine and cosine functions of different frequencies added to input embeddings to inject relative token positions.',
    difficulty: 'medium',
    category: 'Methodology'
  },
  {
    id: 'fc-4',
    paperId: 'p-1',
    question: 'Why does Scaled Dot-Product Attention scale by 1 / sqrt(d_k)?',
    answer: 'For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients. Scaling by 1 / sqrt(d_k) prevents this gradient vanishing issue.',
    difficulty: 'hard',
    category: 'Terminology'
  },
  {
    id: 'fc-5',
    paperId: 'p-1',
    question: 'What are the dimensions of d_model, d_k, d_v, and h (number of heads) in the base Transformer?',
    answer: 'In the base Transformer: d_model = 512, h = 8 heads, and d_k = d_v = d_model / h = 64.',
    difficulty: 'medium',
    category: 'Methodology'
  },
  {
    id: 'fc-6',
    paperId: 'p-1',
    question: 'How does Multi-Head Attention improve over standard Single-Head Attention?',
    answer: 'It allows the model to jointly attend to information from different representation subspaces at different positions. With single-head attention, averaging inhibits this rich multi-aspect representation.',
    difficulty: 'medium',
    category: 'Methodology'
  },
  {
    id: 'fc-7',
    paperId: 'p-1',
    question: 'Explain the masking mechanism inside the Transformer Decoder self-attention stack.',
    answer: 'Masking prevents positions from attending to subsequent (future) positions. It ensures predictions for position i depend only on the known outputs at positions less than i, preserving the auto-regressive property.',
    difficulty: 'hard',
    category: 'Terminology'
  },
  {
    id: 'fc-8',
    paperId: 'p-1',
    question: 'What is the BLEU score achieved by the Large Transformer on WMT 2014 English-to-German translation?',
    answer: 'The Large Transformer achieved a state-of-the-art BLEU score of 28.4, outperforming previous models and ensembles by over 2.0 BLEU.',
    difficulty: 'easy',
    category: 'Findings'
  },
  {
    id: 'fc-9',
    paperId: 'p-1',
    question: 'What is the main physical bottleneck of the Transformer self-attention layer for very long sequences?',
    answer: 'It exhibits quadratic computational and memory complexity O(N^2) with respect to sequence length N, since every token must compute an attention score with every other token in the sequence.',
    difficulty: 'hard',
    category: 'Core Hypotheses'
  },
  {
    id: 'fc-10',
    paperId: 'p-1',
    question: 'What datasets were used to train and evaluate WMT 2014 translation in the paper?',
    answer: 'The standard WMT 2014 English-German dataset (4.5 million sentence pairs) and the English-French dataset (36 million sentence pairs).',
    difficulty: 'easy',
    category: 'Findings'
  },

  // --- PAPER 2: BERT ---
  {
    id: 'fc-11',
    paperId: 'p-2',
    question: 'What does MLM stand for in the context of BERT, and why is it used?',
    answer: 'MLM stands for Masked Language Model. It randomly masks 15% of input tokens and predicts them, allowing the model to learn deep bidirectional representations by conditioning on both left and right context.',
    difficulty: 'medium',
    category: 'Methodology'
  },
  {
    id: 'fc-12',
    paperId: 'p-2',
    question: 'What is the Next Sentence Prediction (NSP) task in BERT pre-training?',
    answer: 'It is a binary classification task where the model predicts whether Sentence B immediately follows Sentence A. This is crucial for learning sentence-level relationships for QA and Natural Language Inference.',
    difficulty: 'easy',
    category: 'Methodology'
  },
  {
    id: 'fc-13',
    paperId: 'p-2',
    question: 'What is the function of the special [CLS] token in BERT?',
    answer: 'The [CLS] classification token is placed at the start of every input sequence. Its final hidden state is used as the aggregate sequence representation for classification tasks.',
    difficulty: 'easy',
    category: 'Terminology'
  },
  {
    id: 'fc-14',
    paperId: 'p-2',
    question: 'Explain the difference between BERT-Base and BERT-Large configurations.',
    answer: 'BERT-Base has L = 12 layers, H = 768 hidden size, A = 12 attention heads (110M parameters). BERT-Large has L = 24 layers, H = 1024 hidden size, A = 16 attention heads (340M parameters).',
    difficulty: 'medium',
    category: 'Terminology'
  },
  {
    id: 'fc-15',
    paperId: 'p-2',
    question: 'What datasets were used to pre-train BERT?',
    answer: 'BERT was pre-trained on BooksCorpus (800 million words) and English Wikipedia (2,500 million words), emphasizing document-level corpora over sentence-shuffled corpora.',
    difficulty: 'easy',
    category: 'Findings'
  },
  {
    id: 'fc-16',
    paperId: 'p-2',
    question: 'What are the two downstream transfer learning strategies for applying pre-trained representations?',
    answer: '1. Feature-based approaches (e.g. ELMo, which include pre-trained representations as frozen features). 2. Fine-tuning approaches (e.g. GPT, which adjust all pre-trained parameters on downstream data). BERT uses Fine-tuning.',
    difficulty: 'medium',
    category: 'Terminology'
  },
  {
    id: 'fc-17',
    paperId: 'p-2',
    question: 'Why is standard GPT unidirectional compared to BERT\'s bidirectional structure?',
    answer: 'GPT uses a left-to-right Transformer where every token can only attend to previous tokens. BERT removes this constraint by using Masked Language Modeling to attend to context in both directions.',
    difficulty: 'hard',
    category: 'Core Hypotheses'
  },
  {
    id: 'fc-18',
    paperId: 'p-2',
    question: 'What performance benchmarks did BERT dominate upon release?',
    answer: 'BERT achieved state-of-the-art results on 11 NLP tasks, including the GLUE benchmark (80.5%), SQuAD v1.1 (93.2% F1), and SQuAD v2.0 (83.1% F1).',
    difficulty: 'easy',
    category: 'Findings'
  },
  {
    id: 'fc-19',
    paperId: 'p-2',
    question: 'What is the [MASK] token mismatch limitation in BERT?',
    answer: 'The [MASK] token appears during pre-training but never during actual fine-tuning or inference. This mismatch can create a slight sub-optimality in learned representations.',
    difficulty: 'hard',
    category: 'Core Hypotheses'
  },
  {
    id: 'fc-20',
    paperId: 'p-2',
    question: 'How is the [MASK] token mismatch partially mitigated in pre-training?',
    answer: 'Of the 15% chosen tokens, 80% are replaced with [MASK], 10% with a random token, and 10% remain unchanged, forcing the model to represent the actual words regardless of masking.',
    difficulty: 'hard',
    category: 'Methodology'
  },

  // --- PAPER 3: RAG ---
  {
    id: 'fc-21',
    paperId: 'p-3',
    question: 'What are the two proposed formulations of RAG?',
    answer: 'RAG-Sequence (retrieves a set of documents and uses the same document to generate the entire sequence) and RAG-Token (retrieves documents and can attend to different documents for each generated token).',
    difficulty: 'hard',
    category: 'Methodology'
  },
  {
    id: 'fc-22',
    paperId: 'p-3',
    question: 'What are the two main structural components of a RAG model?',
    answer: '1. A Dense Passage Retriever (DPR) parameterized by a bi-encoder neural network. 2. An autoregressive sequence-to-sequence generator (parameterized by BART).',
    difficulty: 'easy',
    category: 'Methodology'
  },
  {
    id: 'fc-23',
    paperId: 'p-3',
    question: 'Explain the concept of Parametric vs Non-Parametric memory in RAG.',
    answer: 'Parametric memory corresponds to the pre-trained weights of the sequence generator (BART). Non-parametric memory corresponds to the external vector-indexed document collection (Wikipedia DPR index).',
    difficulty: 'medium',
    category: 'Terminology'
  },
  {
    id: 'fc-24',
    paperId: 'p-3',
    question: 'What is the main advantage of RAG over closed-book parametric models like T5?',
    answer: 'RAG models can update, replace, or customize their knowledge base instantly by swap-replacing the external document index, without requiring expensive neural parameter retraining.',
    difficulty: 'medium',
    category: 'Core Hypotheses'
  },
  {
    id: 'fc-25',
    paperId: 'p-3',
    question: 'What index engine and vector similarity search library were used to support sub-millisecond retrieval in RAG?',
    answer: 'The Wikipedia index consists of 21 million 100-word passages. Fast similarity lookup is supported by a Hierarchical Navigable Small World (HNSW) index built using Facebook AI Similarity Search (FAISS).',
    difficulty: 'hard',
    category: 'Methodology'
  },
  {
    id: 'fc-26',
    paperId: 'p-3',
    question: 'What performance was achieved by RAG-Sequence on open-domain QA benchmarks?',
    answer: 'RAG established a new state-of-the-art on open-domain question answering, scoring 68.0% accuracy on TriviaQA, outperforming standard closed-book parametric BART by 15%.',
    difficulty: 'easy',
    category: 'Findings'
  },
  {
    id: 'fc-27',
    paperId: 'p-3',
    question: 'Describe how a RAG model can be trained end-to-end.',
    answer: 'The retriever and generator are optimized jointly. Backpropagation flows from the generated tokens through the BART generator, back into the DPR query encoder representations, aligning retrieval with generation.',
    difficulty: 'hard',
    category: 'Methodology'
  },
  {
    id: 'fc-28',
    paperId: 'p-3',
    question: 'What is the main performance/latency limitation of the standard RAG pipeline?',
    answer: 'Running dense vector retrieval, document ranking, and FAISS vector indices on top of autoregressive generation significantly increases inference latency and computational overhead.',
    difficulty: 'medium',
    category: 'Core Hypotheses'
  },
  {
    id: 'fc-29',
    paperId: 'p-3',
    question: 'What are "grounded hallucinations" in the context of RAG models?',
    answer: 'If the Dense Passage Retriever fetches irrelevant, noisy, or factually incorrect passages, the sequence generator will incorporate those false details directly into the generated response.',
    difficulty: 'medium',
    category: 'Terminology'
  },
  {
    id: 'fc-30',
    paperId: 'p-3',
    question: 'What future research avenues did the authors suggest to improve RAG models?',
    answer: 'Multi-step/recursive retrieval (retrieving documents sequentially to build reasoning paths), scaling the index to massive web corpora, and vector quantization to optimize FAISS retrieval speed.',
    difficulty: 'easy',
    category: 'Findings'
  }
];

const INITIAL_QUIZZES: Quiz[] = [
  // --- PAPER 1 QUIZ ---
  {
    id: 'q-1',
    paperId: 'p-1',
    title: 'Transformer Core Architecture Quiz',
    questions: [
      {
        question: 'How many identical layers (N) are in the stack of the standard Transformer Encoder?',
        options: ['4 layers', '6 layers', '8 layers', '12 layers'],
        answerIndex: 1,
        explanation: 'The paper specifies that both the Encoder and Decoder stacks use N = 6 identical layers.'
      },
      {
        question: 'What is the dimension size (d_model) of the embedding and sub-layer outputs in the Transformer?',
        options: ['128', '256', '512', '1024'],
        answerIndex: 2,
        explanation: 'All sub-layers and embedding layers produce outputs of dimension d_model = 512 to facilitate residual connections.'
      },
      {
        question: 'In Multi-Head Attention with h=8 heads and d_model=512, what is the dimension (d_k) of each attention head?',
        options: ['32', '64', '128', '512'],
        answerIndex: 1,
        explanation: 'd_k = d_model / h. Hence, 512 / 8 = 64. Each head operates on a projected 64-dimensional subspace.'
      },
      {
        question: 'Which of the following describes the Scaled Dot-Product Attention formula?',
        options: [
          'Attention(Q,K,V) = softmax(QK^T) V',
          'Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) V',
          'Attention(Q,K,V) = sigmoid(QK^T / d_k) V',
          'Attention(Q,K,V) = softmax(Q^T K / sqrt(d_k)) V'
        ],
        answerIndex: 1,
        explanation: 'The standard scaled dot-product attention maps Q, K, and V scaling the product by the inverse square root of d_k before taking the softmax.'
      },
      {
        question: 'What is the computational complexity of a self-attention layer per layer with respect to sequence length N?',
        options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(1)'],
        answerIndex: 2,
        explanation: 'Because every token must attend to every other token, self-attention exhibits quadratic O(N^2) complexity.'
      }
    ],
    score: 100,
    takenAt: '2026-07-12T14:00:00Z'
  },

  // --- PAPER 2 QUIZ ---
  {
    id: 'q-2',
    paperId: 'p-2',
    title: 'BERT Foundations Assessment',
    questions: [
      {
        question: 'What is the percentage of WordPiece tokens masked at random for the Masked Language Model (MLM) objective?',
        options: ['10%', '15%', '20%', '25%'],
        answerIndex: 1,
        explanation: 'In all BERT pre-training experiments, 15% of all WordPiece tokens are masked at random.'
      },
      {
        question: 'Which of the following describes the NSP task in BERT?',
        options: [
          'Negative Sentence Prediction',
          'Next Word Optimization',
          'Next Sentence Prediction',
          'Non-parametric Sequence Processing'
        ],
        answerIndex: 2,
        explanation: 'NSP stands for Next Sentence Prediction, where the model classifies whether Sentence B follows Sentence A.'
      },
      {
        question: 'Which token is placed at the start of every sequence and used for classification tasks?',
        options: ['[SEP]', '[MASK]', '[CLS]', '[PAD]'],
        answerIndex: 2,
        explanation: 'The special classification token [CLS] is added at the start of every sequence. Its final hidden state serves as aggregate sequence context.'
      },
      {
        question: 'What is the pre-training parameter size of the BERT-Large model configuration?',
        options: ['110 Million', '340 Million', '400 Million', '1.5 Billion'],
        answerIndex: 1,
        explanation: 'BERT-Base contains 110M parameters while BERT-Large is configured with 24 layers, 1024 hidden size, and contains 340M parameters.'
      },
      {
        question: 'BERT is pre-trained on which document-level datasets to emphasize contiguous context?',
        options: [
          'BooksCorpus & Wikipedia',
          'Common Crawl & WebText',
          'The Billion Word Benchmark',
          'SQuAD & GLUE'
        ],
        answerIndex: 0,
        explanation: 'BERT pre-training relies heavily on BooksCorpus and English Wikipedia to capture document-level contiguous relationships.'
      }
    ]
  },

  // --- PAPER 3 QUIZ ---
  {
    id: 'q-3',
    paperId: 'p-3',
    title: 'Retrieval-Augmented Generation (RAG) Evaluation',
    questions: [
      {
        question: 'RAG integrates which pre-trained model as its sequence generator?',
        options: ['BERT', 'BART', 'GPT-2', 'T5'],
        answerIndex: 1,
        explanation: 'RAG integrates BART-Large (400M parameters) as its autoregressive sequence generator.'
      },
      {
        question: 'Which formulation of RAG retrieves documents once and uses them to generate the entire sequence?',
        options: ['RAG-Token', 'RAG-Sequence', 'RAG-Batch', 'RAG-DPR'],
        answerIndex: 1,
        explanation: 'RAG-Sequence retrieves K documents once and uses the same documents across the entire target sequence marginalization.'
      },
      {
        question: 'What library and index structure are used for sub-millisecond retrieval of the 21M Wikipedia blocks?',
        options: ['Lucene Sparse BM25', 'FAISS HNSW index', 'ElasticSearch inverted index', 'ChromaDB flat index'],
        answerIndex: 1,
        explanation: 'RAG leverages Facebook AI Similarity Search (FAISS) with a Hierarchical Navigable Small World (HNSW) index for fast lookup.'
      },
      {
        question: 'What is the main consequence of DPR retrieving noisy or incorrect passages?',
        options: [
          'The model crashes with a gradient explosion',
          'The model experiences grounded hallucinations',
          'The model reverts to unidirectional pre-training',
          'BART ignores the retrieved documents entirely'
        ],
        answerIndex: 1,
        explanation: 'Retrieving noisy passages causes the generator to incorporate these false facts, causing grounded hallucinations.'
      },
      {
        question: 'Which objective does RAG leverage to optimize both the retriever and generator simultaneously?',
        options: [
          'Next Sentence Prediction',
          'Masked Language Modeling',
          'End-to-End Joint Differentiable Backpropagation',
          'Contrastive Learning of Sentence Pairs'
        ],
        answerIndex: 2,
        explanation: 'Both components are trained jointly. Backpropagation flows from the sequence loss through BART into DPR, aligning the bi-encoder.'
      }
    ]
  }
];

const INITIAL_LITERATURE_REVIEWS: LiteratureReview[] = [
  {
    id: 'lr-1',
    title: 'Evolution of Transformers: Pre-training to Dense Retrieval Grounding',
    papers: ['p-1', 'p-2', 'p-3'],
    synthesisTable: [
      {
        heading: 'Core Architecture Contribution',
        values: {
          'p-1': 'Dispenses with recurrence and convolution, utilizing solely self-attention.',
          'p-2': 'Bidirectional Transformer Encoder pretraining with Masked Language Modeling (MLM).',
          'p-3': 'Combines a Dense Passage Retriever (DPR) with a BART sequence-to-sequence generator.'
        }
      },
      {
        heading: 'Knowledge Retention & Memory Type',
        values: {
          'p-1': 'Purely parametric memory trained for sequence-to-sequence mapping.',
          'p-2': 'Implicit parametric memory learned via bidirectional MLM and NSP pretraining.',
          'p-3': 'Hybrid memory: non-parametric index memory (DPR) combined with parametric generation memory (BART).'
        }
      },
      {
        heading: 'Primary Limitation Solved',
        values: {
          'p-1': 'Sequential computing limits parallelization and distant context dependency.',
          'p-2': 'Left-to-right (unidirectional) language models are sub-optimal for sentence representation.',
          'p-3': 'Parametric neural models hallucinate, cannot easily update world facts, and lack provenance.'
        }
      }
    ],
    summary: 'This review details the trajectory of modern NLP architectures starting from the standard self-attention block (Transformer, 2017), expanding to deep bidirectional language pretraining (BERT, 2018), and eventually merging parametric generation models with non-parametric corpus retrieval indexes (RAG, 2020).',
    gapAnalysis: 'Research gaps exist in real-time continuous document stream integration, low-latency dense vector updating, and handling conflicting sources dynamically inside the generator context.',
    createdAt: '2026-07-12T18:30:00Z'
  }
];

const INITIAL_SAVED_CITATIONS: SavedCitation[] = [
  {
    id: 'sc-1',
    paperId: 'p-1',
    paperTitle: 'Attention Is All You Need',
    format: 'apa',
    citationText: 'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30, 5998–6008.',
    savedAt: '2026-07-10T10:15:00Z'
  },
  {
    id: 'sc-2',
    paperId: 'p-2',
    paperTitle: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    format: 'bibtex',
    citationText: `@article{devlin2018bert,
  title={BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding},
  author={Devlin, Jacob and Chang, Ming-Wei and Lee, Kenton and Toutanova, Kristina},
  journal={arXiv preprint arXiv:1810.04805},
  year={2018}
}`,
    savedAt: '2026-07-11T12:05:00Z'
  }
];

const INITIAL_STUDY_ACTIVITIES: StudyActivity[] = [
  {
    id: 'sa-1',
    userId: 'u-1',
    type: 'read',
    paperTitle: 'Attention Is All You Need',
    paperId: 'p-1',
    detail: 'Read pages 1-3 and bookmarked core model architecture.',
    timestamp: '2026-07-10T10:20:00Z'
  },
  {
    id: 'sa-2',
    userId: 'u-1',
    type: 'note',
    paperTitle: 'Attention Is All You Need',
    paperId: 'p-1',
    detail: 'Created detailed study note: "Transformer Core Mechanics".',
    timestamp: '2026-07-10T10:31:00Z'
  },
  {
    id: 'sa-3',
    userId: 'u-1',
    type: 'flashcard',
    paperTitle: 'BERT Pre-training',
    paperId: 'p-2',
    detail: 'Reviewed 3 vocabulary cards for MLM concepts.',
    timestamp: '2026-07-11T12:50:00Z'
  },
  {
    id: 'sa-4',
    userId: 'u-1',
    type: 'quiz',
    paperTitle: 'Attention Is All You Need',
    paperId: 'p-1',
    detail: 'Scored 100% on the core architecture assessment.',
    timestamp: '2026-07-12T14:02:00Z'
  }
];

class ServerDatabase {
  constructor() {
    // Note: Automatic seeding in the constructor has been disabled to prevent
    // queries from running before the MongoDB connection is fully established.
    // Seeding is now explicitly called on server startup after a successful connection (Task 2).
  }

  // Seeding helper for MongoDB
  async seedMongoDBIfNeeded() {
    try {
      const userCount = await UserModel.countDocuments();
      
      // Upgrade Migration for existing datasets
      if (userCount > 0) {
        const p1 = await PaperModel.findById('p-1');
        if (p1 && (!p1.pages || p1.pages.length < 10 || !p1.summary)) {
          console.log("Upgrading existing database to high-fidelity 13-page text, summaries, insights, and full flashcards/quizzes...");
          await PaperModel.deleteMany({ _id: { $in: ['p-1', 'p-2', 'p-3'] } });
          await FlashcardModel.deleteMany({ paperId: { $in: ['p-1', 'p-2', 'p-3'] } });
          await QuizModel.deleteMany({ paperId: { $in: ['p-1', 'p-2', 'p-3'] } });
          
          for (const p of INITIAL_PAPERS) {
            await PaperModel.create({ _id: p.id, ...p });
          }
          for (const fc of INITIAL_FLASHCARDS) {
            await FlashcardModel.create({ _id: fc.id, ...fc });
          }
          for (const q of INITIAL_QUIZZES) {
            await QuizModel.create({ _id: q.id, ...q });
          }
          console.log("Database upgrade migration completed successfully.");
        }
      }

      if (userCount === 0) {
        console.log("MongoDB collection 'users' is empty. Performing full seeding...");
        
        for (const u of INITIAL_USERS) {
          // Set password as 'password' which gets hashed automatically via pre-save hook
          await UserModel.create({ _id: u.id, password: 'password', ...u });
        }
        for (const f of INITIAL_FOLDERS) {
          await FolderModel.create({ _id: f.id, ...f });
        }
        for (const p of INITIAL_PAPERS) {
          await PaperModel.create({ _id: p.id, ...p });
        }
        for (const n of INITIAL_NOTES) {
          await NoteModel.create({ _id: n.id, ...n });
        }
        for (const fc of INITIAL_FLASHCARDS) {
          await FlashcardModel.create({ _id: fc.id, ...fc });
        }
        for (const q of INITIAL_QUIZZES) {
          await QuizModel.create({ _id: q.id, ...q });
        }
        for (const lr of INITIAL_LITERATURE_REVIEWS) {
          await LiteratureReviewModel.create({ _id: lr.id, ...lr });
        }
        for (const sc of INITIAL_SAVED_CITATIONS) {
          await SavedCitationModel.create({ _id: sc.id, ...sc });
        }
        for (const sa of INITIAL_STUDY_ACTIVITIES) {
          await StudyActivityModel.create({ _id: sa.id, ...sa });
        }
        
        console.log("MongoDB Atlas database seeded successfully.");
      }
    } catch (err: any) {
      console.error("MongoDB Atlas Seeding failed:", err.message || err);
    }
  }

  // Auth/User Operations
  async getUsers(): Promise<User[]> {
    const docs = await UserModel.find({}).lean();
    return docs.map(d => ({ ...d, id: d._id }) as any);
  }

  async getUser(id: string): Promise<User | undefined> {
    const doc = await UserModel.findById(id).lean();
    if (!doc) return undefined;
    return { ...doc, id: doc._id } as any;
  }

  async createUser(user: User): Promise<User> {
    const doc = await UserModel.create({ _id: user.id, ...user });
    return doc.toJSON() as any;
  }

  // Folder Operations
  async getFolders(): Promise<Folder[]> {
    const docs = await FolderModel.find({}).lean();
    return docs.map(d => ({ ...d, id: d._id }) as any);
  }

  async createFolder(folder: Folder): Promise<Folder> {
    const doc = await FolderModel.create({ _id: folder.id, ...folder });
    return doc.toJSON() as any;
  }

  async deleteFolder(id: string): Promise<void> {
    await FolderModel.deleteOne({ _id: id });
    // Update all papers that were in this folder
    await PaperModel.updateMany({ folderId: id }, { folderId: null });
  }

  // Paper Operations
  async getPapers(): Promise<Paper[]> {
    const docs = await PaperModel.find({}).lean();
    return docs.map(d => ({ ...d, id: d._id }) as any);
  }

  async getPaper(id: string): Promise<Paper | undefined> {
    const doc = await PaperModel.findById(id).lean();
    if (!doc) return undefined;
    return { ...doc, id: doc._id } as any;
  }

  async createPaper(paper: Paper): Promise<Paper> {
    const doc = await PaperModel.create({ _id: paper.id, ...paper });
    return doc.toJSON() as any;
  }

  async updatePaper(id: string, updates: Partial<Paper>): Promise<Paper | undefined> {
    const doc = await PaperModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!doc) return undefined;
    return { ...doc, id: doc._id } as any;
  }

  async deletePaper(id: string): Promise<void> {
    await PaperModel.deleteOne({ _id: id });
    // Delete all dependent sub-resources
    await NoteModel.deleteMany({ paperId: id });
    await FlashcardModel.deleteMany({ paperId: id });
    await QuizModel.deleteMany({ paperId: id });
    await ChatSessionModel.deleteMany({ paperId: id });
    await SavedCitationModel.deleteMany({ paperId: id });
  }

  // Note Operations
  async getNotes(): Promise<Note[]> {
    const docs = await NoteModel.find({}).lean();
    return docs.map(d => ({ ...d, id: d._id }) as any);
  }

  async getNoteForPaper(paperId: string): Promise<Note | undefined> {
    const doc = await NoteModel.findOne({ paperId }).lean();
    if (!doc) return undefined;
    return { ...doc, id: doc._id } as any;
  }

  async createOrUpdateNote(paperId: string, title: string, content: string): Promise<Note> {
    const existing = await NoteModel.findOne({ paperId });
    if (existing) {
      existing.title = title;
      existing.content = content;
      existing.updatedAt = new Date();
      await existing.save();
      return existing.toJSON() as any;
    } else {
      const noteId = `n-${Date.now()}`;
      const doc = await NoteModel.create({
        _id: noteId,
        paperId,
        title,
        content,
        updatedAt: new Date()
      });
      return doc.toJSON() as any;
    }
  }

  // Flashcard Operations
  async getFlashcards(paperId?: string): Promise<Flashcard[]> {
    const query = paperId ? { paperId } : {};
    const docs = await FlashcardModel.find(query).lean();
    return docs.map(d => ({ ...d, id: d._id }) as any);
  }

  async saveFlashcards(cards: Flashcard[]): Promise<void> {
    for (const card of cards) {
      await FlashcardModel.updateOne(
        { _id: card.id },
        { _id: card.id, ...card },
        { upsert: true }
      );
    }
  }

  async updateFlashcardDifficulty(cardId: string, difficulty: 'easy' | 'medium' | 'hard' | null): Promise<Flashcard | undefined> {
    const doc = await FlashcardModel.findByIdAndUpdate(
      cardId,
      { difficulty, lastReviewed: new Date() },
      { new: true }
    ).lean();
    if (!doc) return undefined;
    return { ...doc, id: doc._id } as any;
  }

  // Quiz Operations
  async getQuizzes(paperId?: string): Promise<Quiz[]> {
    const query = paperId ? { paperId } : {};
    const docs = await QuizModel.find(query).lean();
    return docs.map(d => ({ ...d, id: d._id }) as any);
  }

  async getQuiz(id: string): Promise<Quiz | undefined> {
    const doc = await QuizModel.findById(id).lean();
    if (!doc) return undefined;
    return { ...doc, id: doc._id } as any;
  }

  async saveQuiz(quiz: Quiz): Promise<Quiz> {
    await QuizModel.updateOne(
      { _id: quiz.id },
      { _id: quiz.id, ...quiz },
      { upsert: true }
    );
    const doc = await QuizModel.findById(quiz.id).lean();
    return { ...doc, id: doc?._id } as any;
  }

  async submitQuizScore(quizId: string, score: number): Promise<Quiz | undefined> {
    const doc = await QuizModel.findByIdAndUpdate(
      quizId,
      { score, takenAt: new Date() },
      { new: true }
    ).lean();
    if (!doc) return undefined;
    return { ...doc, id: doc._id } as any;
  }

  // Chat Sessions
  async getChats(paperId?: string): Promise<ChatSession[]> {
    const query = paperId ? { paperId } : {};
    const docs = await ChatSessionModel.find(query).lean();
    return docs.map(d => ({ ...d, id: d._id }) as any);
  }

  async getChat(id: string): Promise<ChatSession | undefined> {
    const doc = await ChatSessionModel.findById(id).lean();
    if (!doc) return undefined;
    return { ...doc, id: doc._id } as any;
  }

  async createChat(chat: ChatSession): Promise<ChatSession> {
    const doc = await ChatSessionModel.create({ _id: chat.id, ...chat });
    return doc.toJSON() as any;
  }

  async saveChatMessages(chatId: string, messages: any[]): Promise<void> {
    await ChatSessionModel.findByIdAndUpdate(
      chatId,
      { messages, lastMessageAt: new Date() }
    );
  }

  // Literature Review
  async getLiteratureReviews(): Promise<LiteratureReview[]> {
    const docs = await LiteratureReviewModel.find({}).lean();
    return docs.map(d => ({ ...d, id: d._id }) as any);
  }

  async createLiteratureReview(review: LiteratureReview): Promise<LiteratureReview> {
    const doc = await LiteratureReviewModel.create({ _id: review.id, ...review });
    return doc.toJSON() as any;
  }

  async deleteLiteratureReview(id: string): Promise<void> {
    await LiteratureReviewModel.deleteOne({ _id: id });
  }

  // Saved Citations
  async getSavedCitations(): Promise<SavedCitation[]> {
    const docs = await SavedCitationModel.find({}).lean();
    return docs.map(d => ({ ...d, id: d._id }) as any);
  }

  async saveCitation(citation: SavedCitation): Promise<SavedCitation> {
    const doc = await SavedCitationModel.create({ _id: citation.id, ...citation });
    return doc.toJSON() as any;
  }

  async deleteSavedCitation(id: string): Promise<void> {
    await SavedCitationModel.deleteOne({ _id: id });
  }

  // Activity Logs
  async getActivities(): Promise<StudyActivity[]> {
    const docs = await StudyActivityModel.find({}).sort({ timestamp: -1 }).lean();
    return docs.map(d => ({ ...d, id: d._id }) as any);
  }

  async addActivity(activity: Omit<StudyActivity, 'id' | 'timestamp'>): Promise<StudyActivity> {
    const id = `sa-${Date.now()}`;
    const doc = await StudyActivityModel.create({
      _id: id,
      ...activity,
      timestamp: new Date()
    });
    return doc.toJSON() as any;
  }

  // Dashboard Metrics
  async getMetrics(): Promise<DashboardMetrics> {
    const activities = await this.getActivities();
    const papers = await this.getPapers();
    const folders = await this.getFolders();
    const quizzes = await this.getQuizzes();

    const readActivitiesCount = activities.filter(a => a.type === 'read').length;
    const readingHours = Math.round((readActivitiesCount * 25 + 15) / 10) / 10 + 4.2;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDayIdx = new Date().getDay();
    const dayNamesOrdered = [...days.slice(currentDayIdx), ...days.slice(0, currentDayIdx)];
    
    const weeklyProgress = dayNamesOrdered.map((day, i) => {
      const baseMin = [15, 30, 45, 10, 60, 90, 40][i % 7];
      return {
        day,
        minutes: Math.min(120, baseMin + (activities.length % (i + 1)) * 5)
      };
    });

    return {
      totalPapers: papers.length,
      totalFolders: folders.length,
      quizzesCompleted: quizzes.filter(q => q.score !== undefined).length,
      flashcardsReviewed: activities.filter(a => a.type === 'flashcard').length * 4 + 8,
      readingHours,
      weeklyProgress,
      recentActivity: activities.slice(0, 5)
    };
  }

  // AI Config Operations
  async getAiConfig(): Promise<{ temperature: number; chunkSize: number; persona: string }> {
    const config = await AiConfigModel.findById('global_config').lean();
    if (!config) {
      return { temperature: 0.2, chunkSize: 4000, persona: 'scholarly' };
    }
    return {
      temperature: config.temperature,
      chunkSize: config.chunkSize,
      persona: config.persona
    };
  }

  async saveAiConfig(config: { temperature: number; chunkSize: number; persona: string }): Promise<void> {
    await AiConfigModel.updateOne(
      { _id: 'global_config' },
      { _id: 'global_config', ...config },
      { upsert: true }
    );
  }
}

export const db = new ServerDatabase();
