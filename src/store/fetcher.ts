import {userReference} from '@/firebase/user';

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;

export class Fetcher {
    private currentRequestId = 0;

    constructor(
        private materializeName: string,
        private addPromiseName: string
    ) {
    }

    get newId() {
        return ++this.currentRequestId;
    }

    get currentId() {
        return this.currentRequestId;
    }


    private fetchData(userId: string, commit, requestId: number, retries: number = 0) {
        return userReference(userId).once('value').then(user => {
            const res = {id: userId, ...user.val()};
            commit(this.materializeName, {requestId, ...res});
            return res;
        }).catch((e: any) => {
            if (retries > 0) {
                return this.retryFetchWithDelay(userId, commit, requestId, retries);
            } else if (requestId === this.currentRequestId) {
                commit('setError', e);
                commit(this.addPromiseName, {userId});
            }
        });
    }

    private retryFetchWithDelay(userId: string, commit, requestId: number, retries: number) {
        return new Promise((resolve => setTimeout(
            () => resolve(this.fetchData(userId, commit, requestId, retries - 1)),
            (MAX_RETRIES - retries) * RETRY_DELAY
        )));
    }

    private tryToFetch(userId: string, commit, requestId: number, retries: number = MAX_RETRIES) {
        const promise = this.fetchData(userId, commit, requestId, retries);
        commit(this.addPromiseName, {userId, promise});
    }

    cacheData(dataId: string, commit, promises, requestId: number) {
        const r = promises[dataId];
        if (r) {
            r.then(v => {
                if (v) {
                    commit(this.materializeName, {requestId, ...v});
                } else {
                    this.fetchData(dataId, commit, requestId);
                }
            });
            return;
        }
        return this.tryToFetch(dataId, commit, requestId);
    }
}
