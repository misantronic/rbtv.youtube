const React = require('react');
const Select = require('react-select');
const TimetableComponent = require('../components/timetable/Timetable');

class TimetableModule extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filterValue: 1
        };
    }

    render() {
        const filterOptions = [
            { value: 1, label: 'Montag - Freitag' },
            { value: 2, label: 'Wochenende' }
        ];

        return (
            <div className="module-timetable">
                <div className="filter">
                    <Select options={filterOptions} value={this.state.filterValue} clearable={false} searchable={false} onChange={this._onFilter.bind(this)}/>
                </div>
                <TimetableComponent filter={this.state.filterValue} />
            </div>
        );
    }

    _onFilter(option) {
        const value = option.value;

        this.setState({ filterValue: value });
    }
}

module.exports = TimetableModule;
