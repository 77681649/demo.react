import getHtmlGenerator from './getHtmlGenerator';
import chunksToMap from './build/chunksToMap';

export default service => {
  return class {
    apply(compiler) {
      compiler.hooks.emit.tap('generate-html-files', compilation => {
        //
        // 获得chunks的映射
        // 
        // chunkName -- chunkFiles
        // p__booking__models__booking.js": [
        //  "p__booking__models__booking.js.async.js"
        // ],
        const chunksMap = chunksToMap(compilation.chunks);

        //
        // 创建HTML 生成器
        //
        const hg = getHtmlGenerator(service, {
          chunksMap,
        });

        //
        // 
        //
        hg.generate().forEach(({ filePath, content }) => {
          compilation.assets[filePath] = {
            source: () => content,
            size: () => content.length,
          };
        });
      });
    }
  };
};
