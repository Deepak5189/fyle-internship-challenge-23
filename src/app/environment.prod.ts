export const environment={
  production:true,
  // token: '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',
  token: process.env['token'] || ''
}