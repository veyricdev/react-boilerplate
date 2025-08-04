import { genMessage } from '../helper'

const modulesFiles = import.meta.glob<Recordable>('./vi-VN/**/*.json', { eager: true })

export default {
  translation: {
    ...genMessage(modulesFiles, 'vi-VN'),
  },
}
