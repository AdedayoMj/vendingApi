import {
    DocumentType,
    getModelForClass,
    index,
    modelOptions,
    pre,
    prop,
  } from '@typegoose/typegoose';
  import bcrypt from 'bcryptjs';
  
  @index({ username: 1 })
  @pre<User>('save', async function () {
    // Hash password if the password is new or was updated
    if (!this.isModified('password')) return;
  
    // Hash password with costFactor of 12
    this.password = await bcrypt.hash(this.password, 12);
  })
  @modelOptions({
    schemaOptions: {
      // Add createdAt and updatedAt fields
      timestamps: true,
    },
  })
  
  // Export the User class to be used as TypeScript type
  export class User {
    @prop({ unique: true, required: true })
    username: string;
  
    @prop({ required: true, minlength: 8, maxLength: 32, select: false })
    password: string;
  
    @prop({lowercase: true , required:true })
    role: string;

    @prop({ default: 0 })
    deposit: number;
  
    // Instance method to check if passwords match
    async comparePasswords(hashedPassword: string, candidatePassword: string) {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    }
  }
  
  // Create the user model from the User class
  const userModel = getModelForClass(User);
  export default userModel;
  
  