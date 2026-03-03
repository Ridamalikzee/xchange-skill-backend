export default ({ env }) => {
  const uploadConfig: any = {};

  // Configure Cloudinary if credentials are available, otherwise use local storage
  if (env('CLOUDINARY_CLOUD_NAME')) {
    uploadConfig.upload = {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_CLOUD_NAME'),
          api_key: env('CLOUDINARY_API_KEY'),
          api_secret: env('CLOUDINARY_API_SECRET'),
        },
        actionOptions: {
          upload: {},
          delete: {},
        },
      },
    };
  } else {
    // Default to local file storage if Cloudinary not configured
    uploadConfig.upload = {
      config: {
        provider: 'local',
        actionOptions: {
          upload: {},
          delete: {},
        },
      },
    };
  }

  return uploadConfig;
};
