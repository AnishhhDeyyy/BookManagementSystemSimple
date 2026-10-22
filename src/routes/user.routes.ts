import { Router } from "express";
import { userSchema } from "../validators/user.validator";
import { updateUserSchema } from "../validators/updateuser.validator";
import { validateBody } from "../middlewares/validate";
import { deleteUserById, getAllUser, getByUserId, login, registerUser, updateUserById } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorize.middleware";

const router = Router();
router.post('/register',validateBody(userSchema),registerUser)
router.get('/all',getAllUser)
router.post('/login',login)

router.get("/protected", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authenticated",
    user: req.auth,
  });
});
router.get('/:id',getByUserId)
router.patch('/:id',validateBody(updateUserSchema),updateUserById)
router.delete('/:id',authenticate,authorizeRoles("ADMIN"),deleteUserById)

export default router;
