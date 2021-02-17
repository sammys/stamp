import compose, { Stamp } from '@stamp/compose';

/**
 * @deprecated This feature is now available from the `@stamp/it` package which is preferred.
 */
const Named = compose({
  staticProperties: {
    setName(this: Stamp | undefined, name: string): Stamp {
      return (this?.compose ? this : Named).compose({
        staticPropertyDescriptors: {
          name: { value: name },
        },
      });
    },
  },
});

export default Named;

// For CommonJS default export support
module.exports = Named;
Object.defineProperty(module.exports, 'default', { enumerable: false, value: Named });
