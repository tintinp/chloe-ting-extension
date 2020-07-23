const CONSTANTS = {
  CHLOE: 'CHLOE',
  BEEP: 'BEEP',
  MUSIC: 'MUSIC',
  DEFAULT_SAMPLE_LENGTH: 700,
  EVENTS: {
    START_COLLECTING_DATA: 'START_COLLECTING_DATA',
    STOP_COLLECTING_DATA: 'STOP_COLLECTING_DATA',
    SELECTED_CLASS_CHANGE: 'SELECTED_CLASS_CHANGE',
    SAMPLE_LENGTH_CHANGE: 'SAMPLE_LENGTH_CHANGE'
  },
  WEB_RTC_EVENTS: {
    PEER_CONNECTION_SENDER_READY: 'PEER_CONNECTION_SENDER_READY',
    PEER_CONNECTION_RECEIVER_READY: 'PEER_CONNECTION_RECEIVER_READY',
    PEER_CONNECTION_OFFER: 'PEER_CONNECTION_OFFER',
    PEER_CONNECTION_ANSWER: 'PEER_CONNECTION_ANSWER',
    PEER_CONNECTION_RECEIVER_CANDIDATE: 'PEER_CONNECTION_RECEIVER_CANDIDATE',
    PEER_CONNECTION_SENDER_CANDIDATE: 'PEER_CONNECTION_SENDER_CANDIDATE',
    PEER_CONNECTION_ERROR: 'PEER_CONNECTION_ERROR',
    PEER_CONNECTION_CLOSE: 'PEER_CONNECTION_CLOSE'
  },
  PORTS: {
    WEB_RTC: 'WEB_RTC',
    CROSS_LAYER: 'CROSS_LAYER'
  },
  BUFFER_SIZE: 512
}

export default CONSTANTS
