import $api from "../http";

export default class PatternService {
    static getPatterns() {
        return $api.get('/patterns');
    }

    static getPatternById(patternId) {
        return $api.get(`/patterns/${patternId}`);
    }

    static createPattern(patternData) {
        return $api.post('/patterns/create', patternData);
    }
}
