import { EventEmitter } from 'events'

export default class DistributeManager extends EventEmitter {
  constructor({ node }) {
    super()
    this.node = node

    this.datasets = {}
    this.distributions = {}

    const datasets = this.node.db.get('datasets')

    datasets.on('change', (id, dataset) => {
      if (!dataset && this.datasets[id]) {
        const ds = this.datasets[id]
        this.emit('dataset.remove', ds)
        delete this.datasets[id]
        this.emitChange('datasets')
      } else if (dataset && this.datasets[id]) {
        this.datasets[id] = dataset
        this.emit('dataset.update', dataset)
        this.emitChange('datasets')
      } else if (dataset && !this.datasets[id]) {
        this.datasets[id] = dataset
        this.emit('dataset.create', dataset)
        this.emitChange('datasets')
      }
    })

    const distributions = this.node.db.get('distributions')

    distributions.on('change', (id, distribution) => {
      if (!distribution && this.distributions[id]) {
        const ds = this.distributions[id]
        this.emit('distribution.remove', ds)
        delete this.distributions[id]
        this.emitChange('distributions')
      } else if (distribution && this.distributions[id]) {
        this.distributions[id] = distribution
        this.emit('distribution.update', distribution)
        this.emitChange('distributions')
      } else if (distribution && !this.distributions[id]) {
        this.distributions[id] = distribution
        this.emit('distribution.create', distribution)
        this.emitChange('distributions')
      }
    })
  }

  // name can be:
  // - distributions
  // - datasets
  emitChange(name) {
    this.emit(`${name}.change`, this[name])
  }
}
