const {Router} = require('express')
const usersRouter = new Router()
const UsersController = require('../controllers/usersController')
const usersController = new UsersController()
const uploader = require('../middlewares/uploader')
const myUploader = uploader('documents')

usersRouter.get('/', 
	usersController.getUsers.bind(usersController)
);
	

usersRouter.put('/premium/:uid',
usersController.updateUserRole.bind(usersController)
)

usersRouter.post('/:uid/documents',
	myUploader.array('documents'), 
	usersController.updateUserDocuments.bind(usersController)
)
//endpoint de recuperar password
usersRouter.post('/passwordrecovery',  
	usersController.sendEmailRecovery.bind(usersController)
)

usersRouter.post('/password/reset/:token', 
	usersController.resetPassword.bind(usersController)
);

//eliminar cuenta 
usersRouter.delete('/:userId', 
	usersController.deleteUser.bind(usersController)
);

usersRouter.delete('/', 
	usersController.deleteInactiveUser.bind(usersController)
);

module.exports = usersRouter