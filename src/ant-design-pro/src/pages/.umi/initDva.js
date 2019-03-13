import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'global', ...(require('/Users/tyo/Documents/codes/demo/ant-design-pro-2.2.0/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/tyo/Documents/codes/demo/ant-design-pro-2.2.0/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/tyo/Documents/codes/demo/ant-design-pro-2.2.0/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('/Users/tyo/Documents/codes/demo/ant-design-pro-2.2.0/src/models/menu.js').default) });
app.model({ namespace: 'project', ...(require('/Users/tyo/Documents/codes/demo/ant-design-pro-2.2.0/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/tyo/Documents/codes/demo/ant-design-pro-2.2.0/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/Users/tyo/Documents/codes/demo/ant-design-pro-2.2.0/src/models/user.js').default) });
