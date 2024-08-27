import multer from "multer";
import path from "path";
import fs from "fs";
import { UnprocessableEntity } from "./handleError.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = './uploads/' + file.fieldname;
        fs.mkdirSync(destinationPath, { recursive: true });
        return cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadFiles = multer({
    storage: storage,
    limits: {
        fileSize: 2048000  //2048 KB. In bytes: 2048kb * 1000b.
    },
    fileFilter: (req, file, cb) => {
        // Get the extension of the uploaded file
        const file_extension = file.originalname.slice(
            ((file.originalname.lastIndexOf('.') - 1) >>> 0) + 2
        );
        const allowed_mimetype_image = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
        // file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"
        //     || file.mimetype == "image/webp"
        if (file.fieldname == "import_from_xlsx_csv") {
            let allowed_mimetype_doc = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
            if (allowed_mimetype_doc.includes(file.mimetype))
                cb(null, true);
            else {
                return cb(new UnprocessableEntity('Only .xlsx and .csv format allowed!'))
            }
        }
        else if (allowed_mimetype_image.includes(file.mimetype)) {
            cb(null, true);
        } else {
            return cb(new UnprocessableEntity('Only .webp, .gif, .png, .jpg and .jpeg format allowed!'));
        }
    }
});

export default uploadFiles;