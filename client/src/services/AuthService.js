import $api from "../http";

export default class AuthService {
    static async login(email, password) {
        return $api.post('/login', { email, password });
    }

    static async registration(email) {
        const registrationData = {
          email,
          fullName: 'none',
          departament: 'none',
          role: 'member',
          avatarUrl: 'none',
        };

        return $api.post('/registration', registrationData);
      }

    static async logout() {
        return $api.post('/logout');
    }
}
