import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-enzyme'

configure({ adapter: new Adapter() })

// prevent console.error output during test runs
console.error = () => {}
