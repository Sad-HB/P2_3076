import { Request, Response } from 'express';
import { ContactsModel } from '../models/ContactsModel';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';

export class ContactsController {
  static async add(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, name, comment } = req.body;
      const ip = req.ip || 'unknown';
      const timestamp = new Date().toISOString();
      const dataToSave = { email, name, comment, ip, timestamp };

      
      await ContactsModel.saveContact(dataToSave);

     
      const addFilePath = path.join(__dirname, '/contact/add');
      const contactData = `Email: ${email}, Name: ${name}, Comment: ${comment}, IP: ${ip}, Timestamp: ${timestamp}\n`;
      fs.appendFileSync(addFilePath, contactData);

      res.status(200).send('Contact added successfully');
    } catch (error) {
      res.status(500).send('Error saving contact');
    }
  }

  static async index(req: Request, res: Response) {
    try {
      const contacts = await ContactsModel.getAllContacts();
      res.render('contacts', { contacts });
    } catch (error) {
      res.status(500).send('Error retrieving contacts');
    }
  }
}