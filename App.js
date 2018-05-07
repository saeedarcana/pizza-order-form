import React, { Fragment, Component } from 'react';

class App extends Component {
 
    constructor() {
        super(); 
        this.state = {
            pizza: {size : '', crust: '', flavor: '', quantity: 1},
            size: [],
            crust: [],
            flavor: [],
            cart: [],
            addErrorLabel: '',
            errorLabelDefaultTxt: 'All options must be selected',
            resultMessage: ''
        };
        this.sizeClickHandler = this.sizeClickHandler.bind(this);
        this.crustClickHandler = this.crustClickHandler.bind(this);
        this.flavorClickHandler = this.flavorClickHandler.bind(this);
        this.addCartClickHandler = this.addCartClickHandler.bind(this);
        this.removeFromCartHandler = this.removeFromCartHandler.bind(this);        
        this.changeQuantityHandler = this.changeQuantityHandler.bind(this);
        this.submitCartHandler = this.submitCartHandler.bind(this);
        
    }
    
    componentDidMount() {
        this.setState({size : [ 'Small', 'Medium', 'Large'],
                    crust : ['Thin', 'Pan'],
                    flavor : ['Cheese', 'Roast Beef', 'Veggie Lovers']});
    }
    
    sizeClickHandler = (i) => {
        this.setState({pizza : {size : i, crust : this.state.pizza.crust, flavor : this.state.pizza.flavor
            , quantity : this.state.pizza.quantity}, resultMessage : ''});
    }
    
    crustClickHandler = (i) => {
        this.setState({pizza : {crust : i, size : this.state.pizza.size, flavor : this.state.pizza.flavor
            , quantity : this.state.pizza.quantity}, resultMessage : ''});
    }
    
    flavorClickHandler = (i) => {
        this.setState({pizza : {flavor : i, crust : this.state.pizza.crust, size : this.state.pizza.size
            , quantity : this.state.pizza.quantity}, resultMessage : ''});
    }   
    
    addCartClickHandler = () => {
        if(this.state.pizza.crust === '' || this.state.pizza.flavor === '' ||
                this.state.pizza.size === '') { 
            this.setState({addErrorLabel : this.state.errorLabelDefaultTxt});
            return;
        } else {
            this.setState({addErrorLabel : ''});
        }
        let tempCart = this.state.cart;
        tempCart.push(this.state.pizza);        
        this.setState({cart : tempCart, 
            pizza: {size : '', crust: '', flavor: '', quantity: 1}});
    }
    
    removeFromCartHandler = (item) => {
        var tempCart = [...this.state.cart];
        var index = tempCart.indexOf(item);
        tempCart.splice(index, 1);
        this.setState({cart : tempCart});
    }
    
    changeQuantityHandler = (item, e) => {
        var tempCart = [...this.state.cart];
        var index = tempCart.indexOf(item);
        tempCart[index].quantity = parseInt(e.target.value, 10);
    }
    
    submitCartHandler = () => {
        if(this.state.cart.length > 0) {
            const obj = this;
            if (window.confirm("Please confirm if your Order is Complete")) {                
                fetch('order-pizza', {
                    method: 'POST',
                    body: JSON.stringify(this.state.cart),
                    headers: {
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => response.json()
                .catch(err => {
                    console.err(`'${err}' happened!`);
                    return {};
                })).then(function (body) {
                    console.log(body.message);
                    obj.setState({resultMessage : body.message});
                })
                .catch(error => {
                    alert(error);
                 });
            } else {
                console.log('Incomplete');
            } 
            
            this.setState({cart: []});
        }
    }
    
    render() {
        return (
                <div className="right_col" role="main">
          <div className="">
            <div className="page-title">
              <div className="title_left">
                <h3>Order Pizza</h3>
              </div>
            </div>

            <div className="clearfix"></div>
            <div className="row">
              <div className="col-md-6">
                <div className="x_panel cust-center">
                  <div className="x_title">
                    <h2>Make Your Pizza</h2>                    
                    <div className="clearfix"></div>
                  </div>
                  
                  <div className="cust-center"> 
                    {
                    this.state.size.map((item, i) => 
                    <a className="btn btn-app" key={i} onClick={() => this.sizeClickHandler(item)}>
                    <i className="fa fa-circle-o-notch"></i>{item}
                    </a>)
                    }
                  </div>
                    
                  <div className="cust-center">                    
                    {
                    this.state.crust.map((item, i) => 
                    <a className="btn btn-app" key={i} onClick={() => this.crustClickHandler(item)}>
                    <i className="fa fa-circle-o-notch"></i>{item}
                    </a>)
                    }                   
                  </div>
                  <div className="cust-center">                    
                    {
                    this.state.flavor.map((item, i) => 
                    <a className="btn btn-app" key={i} onClick={() => this.flavorClickHandler(item)}>
                    <i className="fa fa-circle-o-notch"></i>{item}
                    </a>)
                    }            
                  </div>
                </div>
                {this.state.resultMessage}                
              </div>

              <div className="col-md-6">
                <div className="x_panel">
                  <div className="x_title">
                    <h2>Your Current Order</h2>
                    <div className="clearfix"></div>
                  </div>
                  <div className="x_content">                      
                      <table className="table table-striped">
                        <tbody>
                        <tr>
                          <td>Size : {this.state.pizza.size}</td>
                        </tr>
                        <tr>
                          <td>Crust : {this.state.pizza.crust}</td>
                        </tr>
                        <tr>
                          <td>Flavor : {this.state.pizza.flavor}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="buttons">
                      <button type="button" className="btn btn-success btn-xs" onClick={this.addCartClickHandler}>
                      Add to Cart</button>  {this.state.addErrorLabel}
                    </div>
                  </div>
                </div>
                <div className="x_panel">
                  <div className="x_title">
                    <h2>Your Cart</h2>                    
                    <div className="clearfix"></div>
                  </div>
                  <div className="x_content">
                      <table className="table table-hover">
                        <tbody>                       
                        {
                            this.state.cart.map((item, i) => 
                            <Fragment  key={i} >
                             <tr>
                            <td>
                                <label className="control-label">{item.size} {item.crust} {item.flavor}</label>
                            </td>
                          <td>
                                <label className="control-label">Quantity</label>
                        
                                <select className="form-control" onChange={(e) => this.changeQuantityHandler(item, e)}>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                </select>
                          </td>
                          <td><button type="button" className="btn btn-success btn-xs" onClick={() => this.removeFromCartHandler(item)}>
                          Remove</button></td>
                          </tr>
                          </Fragment>
                          )
                        }
                        
                        </tbody>
                    </table>
                    <div className="buttons">
                      <button type="button" className="btn btn-success btn-xs" onClick={this.submitCartHandler}>Submit Order</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
                );
    }
}

export default App;