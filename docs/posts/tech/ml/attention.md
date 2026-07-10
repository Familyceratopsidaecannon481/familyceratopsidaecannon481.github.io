---
date: 2025-12-14
---

# 理解 Attention

:::tip 摘要
[NEURAL MACHINE TRANSLATION BY JOINTLY LEARNING TO ALIGN AND TRANSLATE](https://arxiv.org/pdf/1409.0473.pdf)
:::

## 摘要
> In this paper, we conjecture that the use of a fixed-length vector is a
bottleneck in improving the performance of this basic encoder–decoder architecture, and propose to extend this by allowing a model to automatically (soft-)search
for parts of a source sentence that are relevant to predicting a target word, without
having to form these parts as a hard segment explicitly. With this new approach,
we achieve a translation performance comparable to the existing state-of-the-art
phrase-based system on the task of English-to-French translation. Furthermore,
qualitative analysis reveals that the (soft-)alignments found by the model agree
well with our intuition.

作者觉得用一个固定长度的向量是提升enc-dec架构的一个瓶颈，所以作者的想法是让模型在不需要必须指定某一段(Phrase)的情况下能自然而然的找到原句中关联的部分。同时作者定性分析发现模型从源语言到目标语言的对齐效果和他们做的研究一致。这里需要先理解一下什么叫"hard alignment。
:::tip 知识补充: Phrase-based SMT(PBSMT)
训练PBSMT的时候，准备N对从源语言到目标语言的翻译映射:
```举例
Source: je   t'   aime
Target: I  love  you
```
然后做词对齐，这里会用GIZA++，每个Source的词要么对齐到target内的一个或几个词，要么对不齐。**这种对齐是hard decision，而不是attention的soft decision(系数0-1)**。
```
je   t'   aime
 |    |     |
 I    you love
```
准备好这些句子对后，抽取Phrase。
Phrase的定义是：
```定义
一个源片段 S 和目标片段 T 可以组成一个 phrase pair，当且仅当：
•	S 内的词 只对齐到 T 内
•	T 内的词 只对齐到 S 内
```
拿到所有的Phrase，进行概率统计，也就是每对Phrase出现的频率：
```
je        ↔ I (500次)
aime      ↔ love (200次)
t' aime   ↔ love you (100次)
je t' aime ↔ I love you (90次)
```
而统计时用的是，对于源Phrase，多少比例翻译成了目标Phrase:
```
aime → love   1200 次
aime → like    300 次
aime → adore   100 次
```
$\phi(love \mid aime) =  = 1200 / 1600 = 0.75$ <br/>
这里统计的方式是
$$\phi(e \mid f) = \frac{\text{count}(f, e)}{\sum_{e'} \text{count}(f, e')}$$

拿到这样的Phrase概率表后，对于一次翻译：
```
Source: je t' aime
切分：
[je][t' aime]
[je t'][aime]
[je t' aime]
查Phrase表：
源短语        → 目标短语      概率
----------------------------------
aime          → love         0.62
t' aime       → love you     0.71
je t' aime    → I love you   0.55
...
```
最后进行排序、拼装解码等完成翻译
:::

对比PBSMT，Attention的本质改进是把一种(0/1)硬性打分改为了连续的soft decision。

## 背景
>A potential issue with this encoder–decoder approach is that a neural network needs to be able to
compress all the necessary information of a source sentence into a fixed-length vector. This may
make it difficult for the neural network to cope with long sentences, especially those that are longer
than the sentences in the training corpus. Cho et al. (2014b) showed that indeed the performance of
a basic encoder–decoder deteriorates rapidly as the length of an input sentence increases.

enc-dec结构的问题在于把源句转换成了一个固定长度的向量，这会导致句子越长，向量表意越稠密，越容易丢失信息，最后造成过拟合。而且也有文章提到了如果翻译的句子比训练的时候使用的句子长度长很多，效果也会受到影响。

> In order to address this issue, we introduce an extension to the encoder–decoder model which learns
to align and translate jointly. Each time the proposed model generates a word in a translation, it
(soft-)searches for a set of positions in a source sentence where the most relevant information is
concentrated. The model then predicts a target word based on the context vectors associated with
these source positions and all the previous generated target words.

作者描述了文章解决encdec问题的思路。他们的思路是"learns to align and translate jointly"，这里的jointly指的是训练时，预测的同时又同时可学习对齐分布。对传统的encoder-decoder架构的模型来说不存在PBSMT那样显式对齐的过程，encoder-decoder本质上是使用分布式表示学习带来的相关性信息。