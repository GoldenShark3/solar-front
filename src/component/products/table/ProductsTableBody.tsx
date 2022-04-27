import {IState} from "../../../index";
import {connect, ConnectedProps, useSelector} from "react-redux";
import React from "react";
import {TableBody, TableCell, TableRow} from "@mui/material";
import styles from "../styles.module.css";
import {goToCreateProduct, goToEditProduct} from "../../../redux/products/productActions";

const ProductsTableBody: React.FC<Props> = (props) => {

    // const state = useSelector();



    return (
        <TableBody>
            {props.products.map(product =>
                <TableRow key={product.id}>
                    <TableCell classes={{root: styles.tableCell_body_root}}>
                        <span className={styles.title_column_text}
                            onClick={event => props.goToEditProduct(product.id)}
                        >
                            {product.title}
                        </span>
                    </TableCell>
                    <TableCell classes={{root: styles.tableCell_body_root}}>{product.image}</TableCell>
                    <TableCell classes={{root: styles.tableCell_body_root}}>{product.bulk}</TableCell>
                    <TableCell classes={{root: styles.tableCell_body_root}}>{product.mass}</TableCell>
                    <TableCell classes={{root: styles.tableCell_body_root}}>{product.price}</TableCell>
                    <TableCell classes={{root: styles.tableCell_body_root}}>{product.volume}</TableCell>
                </TableRow>
            )}
        </TableBody>
    )
}

const mapStateToProps = (state: IState) => ({
    products: state.products.products,
})

const mapDispatchToProps = {
    goToEditProduct
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(ProductsTableBody);