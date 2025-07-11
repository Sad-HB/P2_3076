"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const passport_1 = __importDefault(require("passport"));
class AuthController {
    static showLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si hay parámetro lang, guardar cookie manualmente
            if (req.query.lang && ['es', 'en'].includes(req.query.lang)) {
                res.cookie('lang', req.query.lang, { maxAge: 900000, httpOnly: true });
            }
            res.render('login', { error: null, __: res.locals.__, locale: res.locals.locale, request: req });
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate('local', (err, user, info) => {
                if (err)
                    return next(err);
                if (!user) {
                    if (req.query.lang && ['es', 'en'].includes(req.query.lang)) {
                        res.cookie('lang', req.query.lang, { maxAge: 900000, httpOnly: true });
                    }
                    return res.render('login', { error: info.message, __: res.locals.__, locale: res.locals.locale, request: req });
                }
                req.logIn(user, (err) => {
                    if (err)
                        return next(err);
                    const adminEmails = ['admin@gmail.com', 'henzo30765082@gmail.com'];
                    if (user.email && adminEmails.includes(user.email)) {
                        return res.redirect('/admin/dashboard');
                    }
                    req.logout(() => {
                        res.redirect('/?adminError=1');
                    });
                });
            })(req, res, next);
        });
    }
    static logout(req, res) {
        req.logout(() => {
            res.redirect('/login');
        });
    }
    static showRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.render('register', { error: null });
        });
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            try {
                const user = yield req.app.locals.usersModel.createUser(username, password);
                res.redirect('/login');
            }
            catch (err) {
                res.render('register', { error: 'Error al registrar usuario: ' + (err.message || err) });
            }
        });
    }
}
exports.AuthController = AuthController;
