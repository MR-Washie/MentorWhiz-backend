import express from 'express';
import { contactForm } from '../controllers/contact.controller.js';
import multer from "multer";


const router = express.Router();

const upload = multer({ dest: "upload/"})

router.post("/contact",  upload.fields([
  { name: "identityProof", maxCount: 1 },
  { name: "companyProof", maxCount: 1 }
]), contactForm);


export default router;