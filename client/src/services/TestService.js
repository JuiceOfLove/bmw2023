import $api from "../http";

export default class TestService {
    static createTest(testData) {
        return $api.post('/tests/create', testData);
    }

    static getAllTests() {
        return $api.get('/tests');
    }

    static sendTest(testData) {
        return $api.post('/tests/send', testData)
    }

    static sendCompTest(testData) {
        return $api.post('/tests/comp', testData)
    }

    static getTestByStartingLink(startingLink) {
        return $api.get(`/tests/pass/${startingLink}`);
    }

    static sendTestResult(testResults) {
        return $api.post('/tests/results', testResults);
    }

    static getAllResults() {
        return $api.get('/results')
    }

    static getResultById(id) {
        return $api.get(`/results/${id}`);
    }
}
