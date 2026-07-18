---
title: 毒理学家都在用的 6 个 AI 利器，化合物毒性评估快人一步
author: 沈亚萍
account: 不想躺平的HR人
published: 2026-07-17 10:00
saved: 2026-07-18
source: https://mp.weixin.qq.com/s/4HTwmim3izZD9yXYHdS3yg
tags:
  - 微信文章
  - 毒理学
  - AI工具
  - ADMET
  - 药物研发
status: inbox
---

# 毒理学家都在用的 6 个 AI 利器，化合物毒性评估快人一步

> [!info] 来源
> 作者：沈亚萍<br>
> 公众号：不想躺平的HR人<br>
> 发布时间：2026-07-17 10:00<br>
> [查看微信原文](https://mp.weixin.qq.com/s/4HTwmim3izZD9yXYHdS3yg)

## 文章导语

做化合物毒性评估、ADMET 筛选和毒理数据库核对，最耗时的往往是重复的计算与检索。下面 6 个开源工具全部经过实测可访问，覆盖描述符计算、机器学习毒性预测、数据库检索与生成式设计，直接装进你的工作流。

## 01 RDKit

### 怎么用

`pip install rdkit-pypi`，随后 `from rdkit import Chem`。计算 LogP、TPSA、HBD/HBA 等描述符，用 SMARTS 做毒性基团（toxicophore）子结构搜索，配合 PAINS/REOS 规则批量过滤化合物库。

### 为什么值得关注

毒理学家天天要算分子性质、找致毒结构片段。RDKit 是事实标准的开源化学信息学库，一条命令就能把上千个分子的致毒风险特征抽出来，是后续所有建模的基础。

仓库地址：[rdkit/rdkit](https://github.com/rdkit/rdkit)

## 02 DeepChem

### 怎么用

`pip install deepchem`，`import deepchem as dc`。直接调用内置的 Tox21、ToxCast、ClinTox 等毒性基准数据集，用几行代码训练化合物毒性分类器。

### 为什么值得关注

把分子 ML 的门槛降到最低：内置权威毒性数据集和建模流程，让毒理学家不必从头搭管道，就能做高通量虚拟筛选和构效关系（SAR）分析。

仓库地址：[deepchem/deepchem](https://github.com/deepchem/deepchem)

## 03 Chemprop

### 怎么用

`pip install chemprop`。训练：`chemprop train --data-path tox.csv --task-type classification`；预测：`chemprop predict`。支持多任务学习和原子级贡献可视化。

### 为什么值得关注

基于消息传递神经网络（MPNN），对毒性/ADMET 做端到端预测，可拿自有毒理数据微调，还能输出可解释的贡献图——写毒理报告时直接有图有证据。

仓库地址：[chemprop/chemprop](https://github.com/chemprop/chemprop)

## 04 PubChemPy

### 怎么用

`pip install pubchempy`，`from pubchempy import get_compounds`。按化合物名、CAS 号拉取 SMILES、毒性注释与生物测定（BioAssay）结果。

### 为什么值得关注

毒理审查常要和数据库交叉核对。PubChemPy 让你用脚本批量拉取权威毒性注释与活性测定数据，告别手工一个个查网页。

仓库地址：[mcs07/PubChemPy](https://github.com/mcs07/PubChemPy)

## 05 GT4SD

### 怎么用

`pip install gt4sd`。调用预训练生成式模型做分子生成、性质优化与目标导向设计，支持文本/性质条件生成。

### 为什么值得关注

IBM 开源的生成式药物发现工具箱，覆盖分子生成、性质预测与靶向优化。可用于设计低毒候选物、做逆合成与性质引导的从头生成。

仓库地址：[GT4SD/gt4sd-core](https://github.com/GT4SD/gt4sd-core)

## 06 ADMET-AI

### 怎么用

`pip install admet-ai`。命令行：`admet_predict --data_path data.csv --save_path preds.csv --smiles_column smiles`；或用 Python API：`from admet_ai import ADMETModel`。

### 为什么值得关注

基于 Chemprop 在 TDC 41 个 ADMET 数据集上训练，一键预测吸收、分布、代谢、排泄、毒性，是大规模化合物库虚拟筛选最实用的初筛利器。

仓库地址：[swansonk14/admet_ai](https://github.com/swansonk14/admet_ai)

---

> [!note] 收录说明
> 本笔记保留文章的核心正文与工具链接；商品卡片、课程推广和微信页面操作提示等非正文界面内容未收录。
