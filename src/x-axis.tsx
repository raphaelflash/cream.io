import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import React from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";

import { addRegion, removeRegion, shiftRegion } from "./redux/actions";
import { AppState } from "./redux/reducers";
import * as region from "./redux/region";
import { AddRegion } from "./AddCountry";
import * as svg from "./svg";

import "./x-axis.css";

dayjs.extend(dayOfYear);

type TXAxisProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

interface IXAxisState {
  enteringRegion: boolean;
}

class XAxis extends React.PureComponent<TXAxisProps, IXAxisState> {
  constructor(props: TXAxisProps) {
    super(props);

    this.state = { enteringRegion: false };
    this.addRegion = this.addRegion.bind(this);
    this.removeRegion = this.removeRegion.bind(this);
    this.shiftRegionBack1 = this.shiftRegionBack1.bind(this);
    this.shiftRegionBack5 = this.shiftRegionBack5.bind(this);
    this.shiftRegionForward1 = this.shiftRegionForward1.bind(this);
    this.shiftRegionForward5 = this.shiftRegionForward5.bind(this);
    this.showNewRegionInput = this.showNewRegionInput.bind(this);
    this.dismissNewRegionInput = this.dismissNewRegionInput.bind(this);
  }

  addRegion(e: React.KeyboardEvent<HTMLElement>) {
    console.log(e);
  }

  removeRegion(e: React.MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      this.props.removeRegion(parseInt(e.target.dataset["index"]!));
    }
  }

  shiftRegionBack1(e: React.MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      this.props.shiftRegion(parseInt(e.target.dataset["index"]!), 1);
    }
  }

  shiftRegionBack5(e: React.MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      this.props.shiftRegion(parseInt(e.target.dataset["index"]!), 5);
    }
  }

  shiftRegionForward1(e: React.MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      this.props.shiftRegion(parseInt(e.target.dataset["index"]!), -1);
    }
  }

  shiftRegionForward5(e: React.MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      this.props.shiftRegion(parseInt(e.target.dataset["index"]!), -5);
    }
  }

  showNewRegionInput() {
    this.setState({ enteringRegion: true });
  }

  dismissNewRegionInput() {
    this.setState({ enteringRegion: false });
  }

  dayClass(day: dayjs.Dayjs): string {
    let cls = ["region-day"];
    const date = day.dayOfYear();
    if (date % 3 === 1) {
      cls.push("region-day-3");
    }
    if (date % 4 === 1) {
      cls.push("region-day-4");
    }
    return cls.join(" ");
  }

  dayString(day: dayjs.Dayjs): string {
    const date = day.date();
    if (date % 4 === 1 && day.add(1, "day").date() !== 1) {
      return day.format("MMM D");
    }
    if (date % 2 === 0) {
      return "·";
    }
    return day.format("D");
  }

  renderDays(offset: number): JSX.Element {
    const zero = dayjs("2020-01-21");
    return (
      <div className="region-days-wrapper">
        <div className="region-days-gradient" />
        <div
          className="region-days baseline-flex"
          style={{
            transform: `translateX(${offset * 100 / 16}%`
          }}
        >
          {[...Array(50).keys()].map(d => (
            <div key={d} className={this.dayClass(zero.add(d, "day"))}>
              <div className="region-day-inner">
                {this.dayString(zero.add(d, "day"))}
              </div>
              <div className="region-day-inner-mobile">
                {zero.add(d, "day").format("M/D")}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderRegion(r: region.IRegion, i: number): JSX.Element {
    const buttonAttrs = { className: "btn btn-link", "data-index": i };
    return (
      <div className="region-row" key={r.country}>
        <div className="region-shifter region-shifter-left">
          <button {...buttonAttrs} onClick={this.shiftRegionBack5}>
            <svg.ChevronsLeft />
          </button>
          <button {...buttonAttrs} onClick={this.shiftRegionBack1}>
            <svg.ChevronLeft />
          </button>
        </div>
        <div className="region-name-wrapper">
          <div className="region-name">{r.country}</div>
          <button {...buttonAttrs} onClick={this.removeRegion}>
            <svg.TrashSign />
          </button>
        </div>
        {this.renderDays(r.offset)}
        <div className="region-shifter region-shifter-right">
          <button {...buttonAttrs} onClick={this.shiftRegionForward1}>
            <svg.ChevronRight />
          </button>
          <button {...buttonAttrs} onClick={this.shiftRegionForward5}>
            <svg.ChevronsRight />
          </button>
        </div>
      </div>
    );
  }

  renderAddRegion(): JSX.Element {
    return (
      <div id="add-region" className="region-row">
        <button className="btn btn-primary" onClick={this.showNewRegionInput}>
          <svg.PlusSign />
          <span>Add Country / Region</span>
        </button>
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <div id="x-axis">
        <hr />
        {this.props.regions.map((r, i) => this.renderRegion(r, i))}
        {this.state.enteringRegion ? (
          <AddRegion onSuccess={() => this.dismissNewRegionInput()} />
        ) : (
          this.renderAddRegion()
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  regions: state.regions
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ addRegion, removeRegion, shiftRegion }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(XAxis);
