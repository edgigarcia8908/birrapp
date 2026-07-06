import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  beneficiaryName: {
    type: String,
    required: [true, 'El nombre del beneficiario es obligatorio'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pendiente', 'En Progreso', 'Completado'],
    default: 'Pendiente',
  },
  photoBefore: {
    type: String,
    default: null,
  },
  photoAfter: {
    type: String,
    default: null,
  },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
