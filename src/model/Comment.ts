import mongoose, { Schema, Document, Model } from 'mongoose';

interface IComment extends Document {
    sentBy: string;
    loadId: string;
    timestamp: Date;
    content: string;
}

const CommentSchema: Schema<IComment> = new Schema({
    sentBy: {
        type: String,
        required: true,
    },
    loadId: {
        type: String,
        required: true,
        ref: 'Load',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        required: true,
    },
});

// Exporting the Comment model
const CommentModel: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
export default CommentModel;
