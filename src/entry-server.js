// entry-server.js
import createApp from './main';

export default context => {
    return new Promise((resolve, reject) => {
        const { app, router, store } = createApp();

        router.push(context.url);

        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();
            if (!matchedComponents.length) {
                return reject({ code: 404 });
            }

            // 对所有匹配的路由组件调用 `asyncData()`
            Promise.all(matchedComponents.map(Component => {
                if (Component.asyncData) {
                    return Component.asyncData({
                        store,
                        route: router.currentRoute
                    });
                }
            })).then(() => {
                // 在所有预取钩子(preFetch hook) resolve 后，将状态注入到上下文
                context.state = store.state;
                resolve(app);
            }).catch(err => {
                reject(err);
            });
        }, reject);
    });
};