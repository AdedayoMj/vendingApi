import express from 'express';
import { restrictTo } from '../middleware/restrictTo';
import {
    createProductHandler,
    deleteProductHandler,
    getAllProductHandler,
    getProductHandler,
    resizeProductImages,
    updateProductHandler,
    uploadProductImages,
} from '../controllers/product.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import {
    createProductSchema,
    deleteProductSchema,
    getAllProductSchema,
    getProductSchema,
    updateProductSchema,
} from '../schemas/product.schema';


const router = express.Router();



router
    .route('/')
    .post(
        deserializeUser,
        restrictTo('seller'),
        validate(createProductSchema),
        uploadProductImages,
        resizeProductImages,
        createProductHandler
    )
    .get(validate(getAllProductSchema), getAllProductHandler);

router.use(deserializeUser, requireUser);

router
    .route('/:productId')
    .get(validate(getProductSchema), getProductHandler)
    .patch(
        restrictTo('seller'),
        validate(updateProductSchema),
        uploadProductImages,
        resizeProductImages,
        updateProductHandler
    )
    .delete(restrictTo('seller'), validate(deleteProductSchema), deleteProductHandler);

export default router;