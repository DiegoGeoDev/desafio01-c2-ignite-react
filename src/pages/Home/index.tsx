import { useEffect, useState } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { ProductList } from './styles';

interface Product {
	id: number;
	title: string;
	price: number;
	image: string;
}

interface ProductFormatted extends Product {
	priceFormatted: string;
}

interface CartItemsAmount {
	[key: number]: number;
}

const Home = (): JSX.Element => {
	const [products, setProducts] = useState<ProductFormatted[]>([]);
	const { addProduct, cart } = useCart();

	const cartItemsAmount = cart.reduce((sumAmount, product) => {
		return { ...sumAmount, [product.id]: product.amount };
	}, {} as CartItemsAmount);

	useEffect(() => {
		async function loadProducts() {
			const response = (await api('products')).data as Product[];

			setProducts([
				...response.map((product) => {
					return { ...product, priceFormatted: formatPrice(product.price) };
				}),
			]);
		}

		loadProducts();
	}, []);

	function handleAddProduct(id: number) {
		addProduct(id);
	}

	return (
		<ProductList>
			{products &&
				products.map((product: ProductFormatted) => (
					<li key={product.id}>
						<img src={product.image} alt={String(product.id)} />
						<strong>{product.title}</strong>
						<span>{product.priceFormatted}</span>
						<button
							type="button"
							data-testid="add-product-button"
							onClick={() => handleAddProduct(product.id)}
						>
							<div data-testid="cart-product-quantity">
								<MdAddShoppingCart size={16} color="#FFF" />
								{cartItemsAmount[product.id] || 0}
							</div>

							<span>ADICIONAR AO CARRINHO</span>
						</button>
					</li>
				))}
		</ProductList>
	);
};

export default Home;
