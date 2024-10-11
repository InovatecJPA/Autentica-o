export class SessionStrategy {
    async authenticate(auth) {
        return `Session started for user ${auth.id}`;
    }
    async verify(sessionId) {
        if (!sessionId) {
            throw new Error('Invalid session');
        }
        return { id: sessionId };
    }
}
