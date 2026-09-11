import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { validate } from '../../middleware/validate.js';
import { paginate } from '../../middleware/paginate.js';
import { z } from 'zod';
import * as ctrl from '../../controllers/volunteersController.js';

const VolunteerSchema=z.object({
  fullName:z.string().trim().min(2,'Full name is required'), email:z.string().trim().email('A valid email is required'), phone:z.string().trim().min(7,'A valid phone number is required'),
  dob:z.string().optional(), age:z.string().optional(), address:z.string().trim().min(2,'Location is required'), location:z.string().trim().min(2).optional(),
  occupation:z.string().trim().min(2,'Profession / background is required'), profession:z.string().trim().min(2,'Profession / background is required'), mainProfession:z.string().optional(), mainProfessionOther:z.string().optional(), additionalProfessions:z.array(z.string()).optional(), additionalProfessionsOther:z.array(z.string()).optional(), specialization:z.array(z.string()).optional(), specializationOther:z.array(z.string()).optional(),
  associationTypes:z.array(z.string()).optional(), qualification:z.string().optional(), qualificationOther:z.string().optional(), organization:z.string().optional(), role:z.string().optional(), yearsExperience:z.string().optional(),
  businessName:z.string().optional(), industry:z.string().optional(), medicalServiceYears:z.string().optional(), legalRole:z.string().optional(), practiceArea:z.array(z.string()).optional(), studentCourse:z.string().optional(), institution:z.string().optional(), previousProfession:z.string().optional(), expertise:z.string().optional(), skills:z.array(z.string()).optional(), skillsOther:z.array(z.string()).optional(), medicalExpertise:z.array(z.string()).optional(),
  motivation:z.string().optional(), message:z.string().optional(), associations:z.string().optional(), areasOfInterest:z.array(z.string()).optional(), interestsOther:z.array(z.string()).optional(), contributionTypes:z.array(z.string()).optional(), contributionOther:z.array(z.string()).optional(), programsOfInterest:z.array(z.string()).optional(), availability:z.array(z.string()).optional(),
  connectionSource:z.string().optional(), connectionOther:z.string().optional(), referralName:z.string().optional(), referralPhone:z.string().optional(), referralCity:z.string().optional(), sourceDetail:z.string().optional(), sourceType:z.string().optional(), sourceId:z.string().optional(), connectorName:z.string().optional(), connectorType:z.string().optional(),
  helpRequested:z.array(z.string()).optional(), helpRequestedOther:z.array(z.string()).optional(), helpMessage:z.string().optional(), futureRoles:z.array(z.string()).optional(), professionalProfiles:z.record(z.any()).optional(),
  emergencyContactName:z.string().optional(), emergencyContactPhone:z.string().optional(), declaration:z.boolean().optional(), childrenDeclaration:z.boolean().optional(), consent:z.literal(true), formType:z.string().optional(),
}).passthrough().superRefine((data,ctx)=>{
  if(data.dob){const birth=new Date(`${data.dob}T00:00:00`); if(Number.isNaN(birth.getTime())||birth>new Date())ctx.addIssue({code:z.ZodIssueCode.custom,path:['dob'],message:'Please provide a valid date of birth'}); else {const today=new Date(); const age=today.getFullYear()-birth.getFullYear()-(today<new Date(today.getFullYear(),birth.getMonth(),birth.getDate())?1:0); if(age<0||age>120)ctx.addIssue({code:z.ZodIssueCode.custom,path:['dob'],message:'Please provide a valid date of birth'}); if(age<18){if(!data.emergencyContactName?.trim())ctx.addIssue({code:z.ZodIssueCode.custom,path:['emergencyContactName'],message:'Parent / guardian name is required for applicants under 18'});if(!data.emergencyContactPhone?.trim())ctx.addIssue({code:z.ZodIssueCode.custom,path:['emergencyContactPhone'],message:'Parent / guardian phone is required for applicants under 18'});}}}
});

const StatusSchema=z.object({status:z.enum(['New','Under Review','Approved','Rejected','Waitlisted','Withdrawn'])});
const router=Router();
router.post('/volunteers/lookup',asyncHandler(ctrl.lookup));
router.post('/volunteers',validate(VolunteerSchema),asyncHandler(ctrl.submit));
router.get('/admin/volunteers/suggestions',requireAdmin,asyncHandler(ctrl.suggestions));
router.get('/admin/volunteers',requireAdmin,paginate,asyncHandler(ctrl.listAll));
router.delete('/admin/volunteers/:id',requireAdmin,asyncHandler(ctrl.remove));
router.put('/admin/volunteers/:id/status',requireAdmin,validate(StatusSchema),asyncHandler(ctrl.updateStatus));
export default router;
