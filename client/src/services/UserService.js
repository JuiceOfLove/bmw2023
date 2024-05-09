import $api from "../http";

export default class UserService {
    static fetchUsers() {
        return $api.get('/users');
    }

    static getUserById(userId) {
        return $api.get(`/users/${userId}`);
    }

    static async changePassword(userId, oldPassword, newPassword) {
        return $api.post(`/users/${userId}/change-password`, { oldPassword, newPassword });
    }

    static async updateAvatarUrl(userId, avatarFile) {
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const response = await $api.put(`/users/${userId}/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data; // Assuming the server returns a response with updated information
        } catch (error) {
            throw error; // Handle errors as needed
        }
    }

    static async getAvatarUrl(userId) {
        try {
            const response = await $api.get(`/users/${userId}/avatar`);
            return response.data; // Assuming the server returns an object with an 'avatarUrl' property
        } catch (error) {
            throw error; // Handle errors as needed
        }
    }
}
