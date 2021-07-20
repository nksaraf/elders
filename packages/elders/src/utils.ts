export function invariant<T>(
  value: T,
  message: string
): asserts value is Exclude<T, null | undefined | false | '' | 0> {
  if (!value) {
    throw new Error(`Invariant violation: ${message}`);
  }
}

import pino from 'pino';

export type {Logger} from 'pino';

export function createDefaultLogger(options: {level?: string} = {}) {
  return pino({
    serializers: pino.stdSerializers,
    level: options.level ?? 'info',
    name: 'Nostalgie',
    prettyPrint:
      process.env.NODE_ENV !== 'production'
        ? {
            ignore: 'name,hostname,pid',
            translateTime: 'HH:MM:ss.l'
          }
        : false,
    redact: ['req.headers'],
    timestamp: pino.stdTimeFunctions.isoTime
  });
}
