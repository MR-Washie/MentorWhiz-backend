import express from 'express';
import { mentorRegister } from '../controllers/mentorRegister.controller.js';
import multer from "multer";


const router = express.Router();

const upload = multer({ dest: "uploads/"})

router.post("/mentorRegister",  upload.fields([
  { name: "identityProof", maxCount: 1 },
  { name: "companyProof", maxCount: 1 }
]), mentorRegister);




export default router;