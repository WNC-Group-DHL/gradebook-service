
/*
 * Copyright (c) Phó Trí Dũng 2021. All Rights Reserved.
 */
const express = require('express');
const { private, auth } = require('../../utils/aclService');
const router = express.Router();
const usersService = require('../services/usersService');
const service = new usersService();

// Register a new user
router.post('/sign-up', (req, res) => {
    let params = req.body;
    service.register(params)
        .then((data) => res.status(201).send({
            success: true,
            data: data,
            message: "Đăng ký tài khoản thành công"
        }))
        .catch(err => res.status(400).send({ 
            success: false, 
            data: [], 
            message: err.message 
        }));
});

// Create user for admin
router.post('/', private, (req, res) => {
    let params = req.body;
    service.create(params).then((data) => res.status(200).send(data)).
        catch(err => res.status(400).send({ success: false, data: [], message: err.message }));
});

router.post('/admin', auth, (req, res) => {
    let params = req.body;
    params.user_info = req.user;
    service.createAdmin(params).then((data) => res.status(200).send(data)).
        catch(err => res.status(400).send({ success: false, data: [], message: err.message }));
});

//Get user
router.get('/owner', auth, (req, res) => {
    let params = req.body;
    params.user_info = req.user;
    service.details(params).then((data) => res.status(200).send(data)).
        catch(err => res.status(400).send({ success: false, data: [], message: err.message }));
});

//Update user
router.put('/update', auth, (req, res) => {
    let params = req.body;
    params.user_info = req.user;
    service.update(params).then((data) => res.status(200).send(data)).
        catch(err => res.status(400).send({ success: false, data: [], message: err.message }));
});

//Change password
router.post('/change-password', auth, (req, res) => {
    let params = req.body;
    params.user_info = req.user;
    service.changePassword(params).then((data) => res.status(200).send(data)).
        catch(err => res.status(400).send({ success: false, data: [], message: err.message }));
});

//Get list user
router.get('/:user_type', auth, (req, res) => {
    let params = req.body;
    params.user_type=req.params.user_type
    params.user_info = req.user;
    service.listUser(params).then((data) => res.status(200).send(data)).
        catch(err => res.status(400).send({ success: false, data: [], message: err.message }));
});

router.get('/manage/:id', auth, (req, res) => {
    let params = req.body;
    let id = req.params.id;
    params.user_info = req.user;
    service.adminGetUser(id, params).then((data) => res.status(200).send(data)).
    catch(err => res.status(400).send({ success: false, data: [], message: err.message }));
})

router.put('/manage/reset', auth, (req, res) => {
    let params = req.body;
    let userId = params.user_id;
    params.user_info = req.user;
    service.adminResetPassword(userId, params).then((data) => res.status(200).send(data)).
    catch(err => res.status(400).send({ success: false, data: [], message: err.message }));
})

//Update user by admin
router.put('/update/:id', auth, (req, res) => {
    let params = req.body;
    let id = req.params.id;
    params.user_info = req.user;
    service.updateUserByAdmin(id,params).then((data) => res.status(200).send(data)).
        catch(err => res.status(400).send({ success: false, data: [], message: err.message }));
});

// Activate user account, normal user only
router.post('/activation', (req, res) => {
    let params = req.body;
    service.handleActivateAccount(params)
    .then((data) => res.status(200).send(data))
    .catch(err => {
        res.status(400).json({ 
            success: false, 
            data: [], 
            message: err.message 
        })
    })
});

// Verify valid one time code
router.get('/verify/ot-code', (req, res) => {
    let ot_code = req.query.ot_code;
    let params = {
        ot_code: ot_code,
    };
    service.verifyOneTimeToken(params)
    .then((data) => res.status(200).send(data))
    .catch(err => {
        res.status(400).json({ 
            success: false, 
            data: [], 
            message: err.message 
        })
    })
})

// Request reset password user account, normal user only
router.post('/password/forgot', (req, res) => {
    let params = req.body;
    service.handleForgotPassword(params)
    .then((data) => res.status(200).send(data))
    .catch(err => {
        res.status(400).json({ 
            success: false, 
            data: [], 
            message: err.message 
        })
    })
});

// Reset password user account, normal user only
router.post('/password/reset', (req, res) => {
    let params = req.body;
    service.handlePasswordReset(params)
    .then((data) => res.status(200).send(data))
    .catch(err => {
        res.status(400).json({ 
            success: false, 
            data: [], 
            message: err.message 
        })
    })
})

module.exports = router;
