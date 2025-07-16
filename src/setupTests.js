import util from 'util'
import Adapter from '@cfaester/enzyme-adapter-react-18'
import { configure } from 'enzyme'

Object.defineProperty(global, 'TextEncoder', {
    value: util.TextEncoder,
})

configure({ adapter: new Adapter() })
