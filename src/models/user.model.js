import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

const UserSchema = new Schema({
    full_name: { type: String, required: true, maxLength: 150 },
    email: { type: String, unique: true, trim: true, required: true, lowercase: true },
    password: {
        type: String,
        required: function () {
            return this.provider === 'local';
        }
    },
    avatar: { type: String, default: '' },
    provider: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'inactive' },
    verify: {
        type: Boolean,
        default: function () {
            return this.provider === 'local';
        }
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

UserSchema.index({ email: 1 });
UserSchema.index({ status: 1, verify: 1 });

export default model(DOCUMENT_NAME, UserSchema);