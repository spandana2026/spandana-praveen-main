import { Router }  from 'express';
import auth         from './auth.js';
import settings     from './settings.js';
import events       from './events.js';
import volunteers   from './volunteers.js';
import blog         from './blog.js';
import team         from './team.js';
import gallery      from './gallery.js';
import programs     from './programs.js';
import newsletter   from './newsletter.js';
import contact      from './contact.js';
import testimonials from './testimonials.js';
import values       from './values.js';
import stories      from './stories.js';
import upload       from './upload.js';
import emergencyCampaigns from './emergencyCampaigns.js';
import gameListings from './gameListings.js';
import coloring     from './coloring.js';
import system       from './system.js';
import donationOpportunities from './donationOpportunities.js';
import support from './support.js';
import recycleBin from './recycleBin.js';
import mongoose     from 'mongoose';
import { isDbConnected } from '../../config/db.js';
import { env } from '../../config/env.js';

const router = Router();

// Fix: Dashboard tab status endpoint (used by pages/admin/tabs/DashboardTab.tsx)
router.get('/status', (_req, res) => {
  const connected = isDbConnected();
  res.json({
    status: 'ok',
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    storage: {
      mongo: {
        configured: !!env.MONGO_URI,
        connected,
        mode: connected ? 'mongodb' : 'json-fallback',
        readyState: mongoose.connection.readyState,
      },
    },
  });
});

// Fix #22: API documentation endpoint — lists all available routes
router.get('/docs', (_req, res) => {
  res.json({
    version: 'v1',
    baseUrl: '/api/v1',
    authentication: 'Admin session via HttpOnly cookie from POST /api/v1/auth/admin/login',
    pagination: 'All list endpoints accept ?page=1&limit=20',
    endpoints: [
      { method: 'GET',    path: '/settings',                    auth: false, description: 'Live site settings' },
      { method: 'GET',    path: '/admin/system/knowledge',      auth: true,  description: 'Consolidated system knowledge and redacted manifest' },
      { method: 'GET',    path: '/admin/system/export',         auth: true,  description: 'Downloadable redacted JSON system snapshot including MongoDB data when connected' },

      { method: 'GET',    path: '/admin/settings/draft',        auth: true,  description: 'Draft settings' },
      { method: 'PUT',    path: '/admin/settings',              auth: true,  description: 'Save settings draft' },
      { method: 'POST',   path: '/admin/settings/publish',      auth: true,  description: 'Publish draft to live' },
      { method: 'GET',    path: '/events',                      auth: false, description: 'List events (paginated)' },
      { method: 'GET',    path: '/events/:id',                  auth: false, description: 'Get event by ID' },
      { method: 'POST',   path: '/admin/events',                auth: true,  description: 'Create event' },
      { method: 'PUT',    path: '/admin/events/:id',            auth: true,  description: 'Update event' },
      { method: 'DELETE', path: '/admin/events/:id',            auth: true,  description: 'Delete event' },
      { method: 'GET',    path: '/blog',                        auth: false, description: 'List blog posts (paginated)' },
      { method: 'POST',   path: '/volunteers',                  auth: false, description: 'Submit volunteer application' },
      { method: 'GET',    path: '/admin/volunteers',            auth: true,  description: 'List volunteer applications (paginated)' },
      { method: 'PUT',    path: '/admin/volunteers/:id/status', auth: true, description: 'Update volunteer application status; accepted values: New, Under Review, Approved, Rejected, Waitlisted, Withdrawn' },
      { method: 'GET',    path: '/gallery',                     auth: false, description: 'List gallery items (paginated)' },
      { method: 'POST',   path: '/admin/gallery/bulk',          auth: true,  description: 'Bulk upload images' },
      { method: 'POST',   path: '/upload',                      auth: true,  description: 'Authenticated single-image upload used by Admin media controls' },
      { method: 'GET',    path: '/programs',                    auth: false, description: 'List health programs (paginated)' },
      { method: 'GET',    path: '/admin/programs',               auth: true,  description: 'List Core Programs' },
      { method: 'POST',   path: '/admin/programs',               auth: true,  description: 'Create Core Program' },
      { method: 'PUT',    path: '/admin/programs/:id',            auth: true,  description: 'Update Core Program' },
      { method: 'POST',   path: '/admin/programs/:id/reorder',    auth: true,  description: 'Move Core Program up or down within its care pillar' },
      { method: 'POST',   path: '/admin/programs/reconcile-canonical', auth: true, description: 'Reconcile approved Sahara program catalogue' },

      { method: 'GET',    path: '/donation-opportunities',       auth: false, description: 'List published donation opportunities (paginated)' },
      { method: 'GET',    path: '/admin/donation-opportunities', auth: true,  description: 'List donation opportunities' },
      { method: 'POST',   path: '/admin/donation-opportunities', auth: true,  description: 'Create donation opportunity' },
      { method: 'PUT',    path: '/admin/donation-opportunities/:id', auth: true, description: 'Update donation opportunity' },
      { method: 'DELETE', path: '/admin/donation-opportunities/:id', auth: true, description: 'Delete donation opportunity' },
      { method: 'GET', path: '/support/catalog', auth: false, description: 'Public support catalogue' },
      { method: 'GET', path: '/support/currency-rates', auth: false, description: 'Cached USD conversion rates for enabled international currencies' },
      { method: 'GET', path: '/support/payment-profiles', auth: false, description: 'Public enabled payment profiles' },
      { method: 'POST', path: '/contributions', auth: false, description: 'Create cash or in-kind contribution' },
      { method: 'GET', path: '/admin/support/catalog', auth: true, description: 'Admin support aggregate' },
      { method: 'GET', path: '/admin/fundraising-campaigns', auth: true, description: 'List fundraising campaigns' },
      { method: 'POST', path: '/admin/fundraising-campaigns', auth: true, description: 'Create fundraising campaign' },
      { method: 'PUT', path: '/admin/fundraising-campaigns/:id', auth: true, description: 'Update fundraising campaign' },
      { method: 'DELETE', path: '/admin/fundraising-campaigns/:id', auth: true, description: 'Delete fundraising campaign' },
      { method: 'GET', path: '/admin/requirements', auth: true, description: 'List requirements' },
      { method: 'POST', path: '/admin/requirements', auth: true, description: 'Create requirement' },
      { method: 'PUT', path: '/admin/requirements/:id', auth: true, description: 'Update requirement' },
      { method: 'DELETE', path: '/admin/requirements/:id', auth: true, description: 'Delete requirement' },
      { method: 'GET', path: '/admin/contributions', auth: true, description: 'List contributions' },
      { method: 'PUT', path: '/admin/contributions/:id', auth: true, description: 'Update in-kind contribution status' },
      { method: 'GET', path: '/admin/transactions', auth: true, description: 'List transactions' },
      { method: 'PUT', path: '/admin/transactions/:id', auth: true, description: 'Update transaction status' },
      { method: 'POST', path: '/admin/transactions/:transactionId/receipt', auth: true, description: 'Create receipt for paid transaction' },
      { method: 'GET', path: '/admin/receipts', auth: true, description: 'List receipts' },
      { method: 'GET', path: '/admin/refunds', auth: true, description: 'List refunds' },
      { method: 'POST', path: '/admin/refunds', auth: true, description: 'Request refund' },
      { method: 'PUT', path: '/admin/refunds/:id', auth: true, description: 'Update refund' },
      { method: 'GET', path: '/admin/payment-profiles', auth: true, description: 'List payment profiles' },
      { method: 'POST', path: '/admin/payment-profiles', auth: true, description: 'Create payment profile' },
      { method: 'PUT', path: '/admin/payment-profiles/:id', auth: true, description: 'Update payment profile' },
      { method: 'DELETE', path: '/admin/payment-profiles/:id', auth: true, description: 'Delete payment profile' },
      { method: 'GET', path: '/admin/support/reports', auth: true, description: 'Donation and support summary' },
      { method: 'POST',   path: '/newsletter/subscribe',        auth: false, description: 'Subscribe to newsletter' },
      { method: 'POST',   path: '/newsletter/unsubscribe',      auth: false, description: 'Unsubscribe from newsletter' },
      { method: 'POST',   path: '/contact',                     auth: false, description: 'Submit contact form' },
      { method: 'POST', path: '/auth/admin/login', auth: false, description: 'Admin login — establishes HttpOnly session cookie' },
      { method: 'POST',   path: '/auth/team/login',             auth: false, description: 'Team member login' },
      { method: 'GET',    path: '/admin/team',                  auth: true,  description: 'List team members' },
      { method: 'GET',    path: '/testimonials',                auth: false, description: 'List testimonials (paginated)' },
      { method: 'GET',    path: '/values',                      auth: false, description: 'List values (paginated)' },
      { method: 'GET',    path: '/stories',                     auth: false, description: 'List stories (paginated)' },
      { method: 'GET',    path: '/team/resources',              auth: true,  description: 'List team portal resources (team-member token)' },
      { method: 'GET',    path: '/visitor-count',                auth: false, description: 'Get live visitor counter' },
      { method: 'POST',   path: '/visitor-count/increment',      auth: false, description: 'Increment live visitor counter' },
      { method: 'POST',   path: '/coloring/generate',            auth: false, description: 'Generate a colouring-page SVG from a text prompt' },
      { method: 'POST',   path: '/newsletter/sync-to-sheet',     auth: true,  description: 'Sync subscribers to a configured Google Sheets webhook' },
    ],
  });
});

router.use(auth);
router.use(settings);
router.use(events);
router.use(volunteers);
router.use(blog);
router.use(team);
router.use(gallery);
router.use(programs);
router.use(newsletter);
router.use(contact);
router.use(testimonials);
router.use(values);
router.use(stories);
router.use(upload);
router.use(emergencyCampaigns);
router.use(gameListings);
router.use(coloring);
router.use(system);
router.use(donationOpportunities);
router.use(support);
router.use(recycleBin);

export default router;
