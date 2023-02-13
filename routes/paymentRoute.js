import express from 'express'
import { buySubscription, cancelSubscription } from '../controllers/paymentControoler.js'
import { authorizedAdmin, isAuthenticated } from '../middlewares/auth.js'
const router=express.Router()
router.route('/buysubscription').post(isAuthenticated,buySubscription)
router.route('/canselsubscription').delete(isAuthenticated,cancelSubscription)



export default router