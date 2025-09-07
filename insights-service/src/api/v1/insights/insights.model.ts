import { Schema, model, Document } from 'mongoose';

export interface ISearchResult {
  title: string;
  url: string;
}

export interface IContentResult {
  url: string;
  title: string;
  content: string;
  extractedAt: Date;
  success: boolean;
  error?: string;
}

export interface IInsightResult {
  prompts: string[];
  searchResults: ISearchResult[];
  content: IContentResult[];
  insights: string;
  context: string;
  success: boolean;
  error?: string;
}

export interface IInsight extends Document {
  userId: string;
  prompts: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results?: IInsightResult[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  success: boolean;
  error?: string;
}

const searchResultSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    summary: { type: String, required: true },
  },
  { _id: false }
);

const contentResultSchema = new Schema(
  {
    url: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    extractedAt: { type: Date, required: true },
    success: { type: Boolean, required: true },
    error: { type: String },
  },
  { _id: false }
);

const insightResultSchema = new Schema(
  {
    prompts: [{ type: String, required: true }],
    searchResults: [searchResultSchema],
    content: [contentResultSchema],
    context: { type: String },
    insights: { type: String, required: true },
    success: { type: Boolean, required: true },
    error: { type: String },
  },
  { _id: false }
);

const insightSchema = new Schema<IInsight>({
  userId: { type: String, required: true, index: true },
  prompts: [{ type: String, required: true }],
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true,
  },
  results: [insightResultSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  success: { type: Boolean, default: false },
  error: { type: String },
});

insightSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Insight = model<IInsight>('Insight', insightSchema);
