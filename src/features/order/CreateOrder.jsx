import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import { getCart, clearCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store"
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );


function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {
    username, 
    status: addressStatus, 
    address, 
    position,
    error: errorAddress,
  } = useSelector(state => state.user);
  const isLoadingAddress = addressStatus === "laoding";
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();

  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? (20/100) * totalCartPrice : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  const dispatch = useDispatch();

  if (!cart.length) return <EmptyCart/>;

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-8">Ready to order? Lets go!</h2>

      

      {/* <Form method="POST" action="/order/new"></Form> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input className="input grow" type="text" name="customer" defaultValue={username} required />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
          </div>
          {formErrors?.phone && <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-md">{formErrors.phone}</p>}
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input className="input w-full" type="text" name="address" disabled={isLoadingAddress} defaultValue={address} required />
            {addressStatus === "error" && <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-md">{errorAddress}</p>}
          </div>
          {!position.latitude && !position.longitude && <span className="absolute right-[2px] top-[35px] z-50 sm:right-[1px] sm:top-[3px] md:right-[1px] md:top-[1px]">
          <Button type="small" disabled={isLoadingAddress} onClick={(e) => {
            e.preventDefault();
            dispatch(fetchAddress());
            }}>Get Position</Button>
          </span>}
        </div>

        <div className="mb-12 flex gap-5 items-center">
          <input
          className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            checked={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name="position" value={position.longitude && position.latitude ? `${position.latitude},${position.longitude}` : ""}/>
          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting ? "Placing your Order..." : `Order now (${formatCurrency(totalPrice)})`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  };

  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (Object.keys(errors).length > 0) return errors;

  //if all good, create the order & redirect to order page
  const newOrder = await createOrder(order);

  //never overuse this method
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
