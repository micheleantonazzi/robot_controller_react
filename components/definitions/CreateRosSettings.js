export const CreateRosSettings = oldRosSettings => {
  const ret = {
    is_connected: false,
    ros_connector: null,
    map_listener: null,
    pose_listener: null,
    camera_info_listener: null,
    cmd_vel_publisher: null,
    map_topic: '/map',
    pose_topic: '/amcl_pose',
    camera_url: 'http://192.168.1.81:8089/stream?topic=/usb_cam/image_raw',
    control_topic: '/cmd_vel',
  };
  if (oldRosSettings !== null) {
    for (let key in ret) ret[key] = oldRosSettings[key];
  }
  return ret;
};
