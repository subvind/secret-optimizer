export default {
  title: 'members schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    // authenticate
    username: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    // activity
    isOnline: {
      type: 'boolean',
      default: false
    },
    isVisible: {
      type: 'boolean',
      default: false
    },
    // sync intel
    isEnabled: {
      type: 'boolean',
      default: false
    },
    // data recovery
    isServer: {
      type: 'boolean',
      default: false
    },
    isLocal: {
      type: 'boolean',
      default: false
    },
    isRemote: {
      type: 'boolean',
      default: false
    },
    // relationship
    isPerson: {
      type: 'boolean',
      default: false
    },
    isFamily: {
      type: 'boolean',
      default: false
    },
    isFriend: {
      type: 'boolean',
      default: false
    },
    isAnnonymous: {
      type: 'boolean',
      default: false
    },
    // fake/genuine
    isDecoy: {
      type: 'boolean',
      default: false
    },
    isParody: {
      type: 'boolean',
      default: false
    },
    // business
    isBusiness: {
      type: 'boolean',
      default: false
    },
    isEmployee: {
      type: 'boolean',
      default: false
    },
    isSubordinate: {
      type: 'boolean',
      default: false
    },
    isBoss: {
      type: 'boolean',
      default: false
    },
    isCoWorker: {
      type: 'boolean',
      default: false
    },
    isCustomer: {
      type: 'boolean',
      default: false
    },
    // consensus
    isElection: {
      type: 'boolean',
      default: false
    },
    isCandidate: {
      type: 'boolean',
      default: false
    },
    isLeader: {
      type: 'boolean',
      default: false
    },
    isFollowing: {
      type: 'boolean',
      default: false
    },
    isFollower: {
      type: 'boolean',
      default: false
    },
    // society
    isSocialNetwork: {
      type: 'boolean',
      default: false
    },
    isSubscribing: {
      type: 'boolean',
      default: false
    },
    isSubscriber: {
      type: 'boolean',
      default: false
    },
    // discovery
    isVerified: {
      type: 'boolean',
      default: false
    },
    isInvitation: {
      type: 'boolean',
      default: false
    },
    isApplication: {
      type: 'boolean',
      default: false
    },
    // share secrets with
    isTrust: {
      type: 'boolean',
      default: false
    },
    // cancel
    isBanned: {
      type: 'boolean',
      default: false
    },
  },
  required: ['id', 'username', 'password'],
  indexes: [
    'username'
  ]
}