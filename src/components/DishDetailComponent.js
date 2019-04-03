import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem,
     Button, Modal, ModalHeader, ModalBody,Row, Label, Col} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from  './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

    function RenderComments({comments, postComment, dishId}){
        
        if (comments != null) {
            return (
            <div className="col-12 col-md-8 m-1">
                    <h4>Comments</h4>
                    <ul className="list-unstyled">
                    <Stagger in>
                        {comments.map((comment)=> {
                            return(
                                <Fade in>
                                    <li key={comment.id} className="mt-2"> 
                                     {comment.comment}  <br /> 
                                     -- {comment.author} , {new Intl.DateTimeFormat('en-US',{year:'numeric',month:'short',day:'2-digit' }).format(new Date(Date.parse(comment.date)))} </li>
                                </Fade>
                            );
                        })}
                    </Stagger>
                    {/* <CommentForm dishId={dishId} postComment={postComment}/> */}
                </ul>
            </div>
            );
        }
        return (
            <div> </div>
        )
    }

    const required = (val) => val && val.length;
    const maxLength= (len) => (val) => !(val) || (val.length <= len);
    const minLength = (len) => (val) => (val) && (val.length >= len);
    
    class CommentForm extends Component{
        constructor(props){
            super(props);
            this.state = {
                isModalOpen: false
            };
            this.toggleModal = this.toggleModal.bind(this);
            this.handleform = this.handleform.bind(this);
        }
        toggleModal(){
            this.setState ({
                isModalOpen: !this.state.isModalOpen
            }); 
        }
        handleform(values){
            this.toggleModal();
            this.props.postComment(this.props.dishId, values.rating, values.author,values.comment)
        }
        render(){
            return(
                <div>
                    <Button outline onClick={this.toggleModal} >
                        <span className="fa fa-pencil">Submit Comment</span>
                    </Button>
                    <Modal isOpen={this.state.isModalOpen} toggle= {this.toggleModal}>
                        <ModalHeader toggle= {this.toggleModal}>Submit Comment</ModalHeader>
                        <ModalBody>
                            <LocalForm onSubmit={(values)=> this.handleform(values)}>
                                <Row className="form-group">
                                    <Label htmlFor="rating" md={2}>Rating</Label>
                                    <Col md={12}>
                                        <Control.select model=".rating" id="rating" name="rating"
                                            className="form-control">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </Control.select>
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="name" md={4}>Your Name</Label>
                                    <Col md={12}>
                                        <Control.text model=".name" id="name" name="name"
                                         placeholder="Your Name"
                                         className="form-control"
                                         validators= {{
                                             required, 
                                             minLength: minLength(3),
                                             maxLength: maxLength(15)
                                         }}
                                        />
                                        <Errors
                                            className="text-danger"
                                            model=".name"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 2 characters',
                                                maxLength: 'Must be 15 characters or less'
                                            }}
                                        />
                                       
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="comment" md={2}>Comment</Label>
                                    <Col md={12}>
                                        <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="6" className="form-control"
                                        ></Control.textarea>
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col md={{size: 10, offset: 2}}>
                                        <Button type="submit" color="primary">
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                            </LocalForm>
                        </ModalBody>
                    </Modal>
                </div>
            );
        }
        
    }

    function RenderDish({dish}) {
        if(dish != null){
            return(
                <FadeTransform in 
                transformProps={{
                    exitTransform: 'scale(0.5) translatey(-50%)'}}>
                     <Card>
                        <CardImg width="100%" src= {dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>
            );
        }
        else{
            return(
                <div></div>
            );
        }
    }

    const DishDetail = (props) => {
        if(props.isLoading){
            return(
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>  
            );
        }
        else if(props.errMess){
            return(
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div> 
            );
        }
        else if(props.dish){
            return(
                <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>{props.dish.name}</h3>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-5 m-1">
                            {/* {this.renderDish(dish)} */}
                            <RenderDish dish ={props.dish}/>
                        </div>
                        <div className="col-12 col-md-5 m-1">
                            {/* {this.renderComments(dish.comments)} */}
                            <RenderComments comments = {props.comments}
                                postComment= {props.postComment}
                                dishId = {props.dish.id}/>
                            
                        </div>
                    </div>
                </div>
            );
        }else{
            return(
                <div></div>
            );
        }
    }
        

export default DishDetail;