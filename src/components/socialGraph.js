import React, {Component} from 'react'
import Dimensions from 'react-dimensions'
import {connect} from "react-redux";
import {fetchSocialGraph} from '../store/actions/peopleActions'
import {ForceGraph2D, ForceGraph3D} from "react-force-graph";
import {Loader} from "semantic-ui-react";

export class SocialGraph extends Component {
    componentWillMount() {
        if (!this.props.fetched) {
            this.props.dispatch(fetchSocialGraph())
        }
    }

    render() {
        var width = this.props.containerWidth
        const data = this.props.socialGraph;
        var graph;
        if (this.props.fetched && this.props.socialGraph.nodes.length > 0) {
            graph = <ForceGraph2D
                graphData={data}
                nodeAutoColorBy="group"
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.id;
                    const fontSize = 12/globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle ='#211F1F'; //node.color;
                    ctx.fillText(label, node.x, node.y);
                }}
            />
        }
        else {
            graph = <Loader active>Fetching Social Graph</Loader>
        }

        return (
            <div>
                {graph}
            </div>

        )

        // var width = this.props.containerWidth
        // // console.log('social graph width',width)
        // var myConfig = {
        // 	automaticRearrangeAfterDropNode: false,
        // 	staticGraph:true,
        //     nodeHighlightBehavior: true,
        //     maxZoom: 4,
        //     minZoom: 0.1,
        //     node: {
        //     	fontSize: 10,
        //     	size: 500,
        //         color: 'lightblue',
        //         highlightFontSize: 15,
        //         highlightStrokeColor: 'orange'
        //     },
        //     link: {
        //         highlightColor: 'orange',
        //         color: '#12939A',
        //     },
        //     height: this.props.height,
        //     width: width
        // }
        //

        //
        // console.log(this.props)
        // return (
        // 	<div>
        // 		{graph}
        // 	</div>
        // )
    }
}


SocialGraph = connect((store) => {
    return {
        socialGraph: store.people.socialGraph,
        fetching: store.people.fetchingSocialGraph,
        fetched: store.people.fetchedSocialGraph,
    }
})(SocialGraph)

export default Dimensions()(SocialGraph)
