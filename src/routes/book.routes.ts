import { Router } from "express";
import { validateBody } from "../middlewares/validate";
import { createBookSchema } from "../validators/book.validator";
import { updateBookSchema } from "../validators/updatebook.validator";
import { createBook, deleteTheBook, getBookAll, getBookById, updateTheBook } from "../controllers/book.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorize.middleware";

const router = Router();
router.post('/create', validateBody(createBookSchema),authenticate,authorizeRoles("ADMIN"), createBook);
router.patch('/:id', validateBody(updateBookSchema), authenticate, authorizeRoles("ADMIN"), updateTheBook);
router.get('/all',authenticate,getBookAll)
router.get('/:id',getBookById)
router.delete('/:id',authenticate,authorizeRoles("ADMIN"),deleteTheBook)

export default router;